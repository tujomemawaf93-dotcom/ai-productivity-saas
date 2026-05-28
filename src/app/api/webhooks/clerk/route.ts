import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    // Этот секрет мы получим в панели Clerk на следующем шаге
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Пожалуйста, добавьте CLERK_WEBHOOK_SECRET в .env');
    }

    // Получаем заголовки для проверки подписи
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Ошибка: отсутствуют заголовки svix', { status: 400 });
    }

    // Получаем тело запроса
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Ошибка верификации вебхука:', err);
        return new Response('Ошибка верификации', { status: 400 });
    }

    const eventType = evt.type;

    // Логика создания пользователя
    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        const primaryEmail = email_addresses && email_addresses.length > 0
            ? email_addresses[0].email_address
            : `no-email-${id}@aether.local`;
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'Пользователь';

        // Создаем юзера и его дефолтный воркспейс в одной транзакции
        await db.$transaction(async (tx) => {
            await tx.user.upsert({
                where: { id },
                update: {
                    email: primaryEmail,
                    name: name,
                    imageUrl: image_url,
                },
                create: {
                    id,
                    email: primaryEmail,
                    name: name,
                    imageUrl: image_url,
                }
            });

            // Проверяем, есть ли уже у пользователя воркспейсы
            const workspacesCount = await tx.workspace.count({
                where: { userId: id }
            });

            if (workspacesCount === 0) {
                // Создаем дефолтный воркспейс, используя Clerk ID для уникального slug
                const defaultSlug = `personal-${id.toLowerCase()}`;
                await tx.workspace.create({
                    data: {
                        name: "Личное пространство",
                        slug: defaultSlug,
                        theme: "purple",
                        userId: id,
                    }
                });
            }
        });
    } else if (eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        const primaryEmail = email_addresses && email_addresses.length > 0
            ? email_addresses[0].email_address
            : `no-email-${id}@aether.local`;
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'Пользователь';

        await db.user.upsert({
            where: { id },
            update: {
                email: primaryEmail,
                name: name,
                imageUrl: image_url,
            },
            create: {
                id,
                email: primaryEmail,
                name: name,
                imageUrl: image_url,
            }
        });
    }

    // Логика удаления пользователя
    if (eventType === 'user.deleted') {
        const { id } = evt.data;
        if (id) {
            await db.user.delete({ where: { id } });
        }
    }

    return new Response('Вебхук успешно обработан', { status: 200 });
}