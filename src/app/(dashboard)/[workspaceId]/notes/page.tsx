import React from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { getFoldersAndNotes } from "@/app/actions/notes";
import { NotesApp } from "@/components/notes/NotesApp";

export default async function NotesPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  
  // Получаем начальные данные с сервера
  const initialData = await getFoldersAndNotes(workspaceId);

  return (
    <PageContainer
      title="Умные Заметки"
      description="Мощный редактор с поддержкой Markdown, организацией по папкам и ИИ-генерацией выжимок."
    >
      <div className="h-[calc(100vh-14rem)] flex w-full">
        <NotesApp workspaceSlug={workspaceId} initialData={initialData} />
      </div>
    </PageContainer>
  );
}
