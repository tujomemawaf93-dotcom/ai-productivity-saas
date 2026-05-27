"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Описание интерфейсов в точном соответствии с Clerk SDK
interface User {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  primaryEmailAddress: {
    emailAddress: string;
  } | null;
  imageUrl: string;
}

interface ClerkContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, name?: string) => Promise<void>;
}

const ClerkContext = createContext<ClerkContextType | null>(null);

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Считываем активную сессию из кук
    const cookies = typeof document !== "undefined" ? document.cookie : "";
    const hasSession = cookies.includes("aether-session");

    if (hasSession) {
      // Пытаемся получить сохраненные данные пользователя из localStorage
      const savedUser = localStorage.getItem("aether-user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(getFallbackUser());
        }
      } else {
        setUser(getFallbackUser());
      }
      setIsSignedIn(true);
    } else {
      setUser(null);
      setIsSignedIn(false);
    }
    setIsLoaded(true);
  }, []);

  const getFallbackUser = (): User => ({
    id: "user_mock_12345",
    fullName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    primaryEmailAddress: {
      emailAddress: "john@aether.os",
    },
    imageUrl: "",
  });

  const signIn = async (email: string, name?: string) => {
    setIsLoaded(false);
    
    // Создаем сессию
    document.cookie = "aether-session=mock-active-user-session; path=/; max-age=86400";
    
    const displayName = name || email.split("@")[0];
    const first = displayName.split(" ")[0] || displayName;
    const last = displayName.split(" ")[1] || "";

    const newUser: User = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      fullName: displayName,
      firstName: first,
      lastName: last,
      primaryEmailAddress: {
        emailAddress: email,
      },
      imageUrl: "",
    };

    localStorage.setItem("aether-user", JSON.stringify(newUser));
    setUser(newUser);
    setIsSignedIn(true);
    setIsLoaded(true);
  };

  const signOut = async () => {
    setIsLoaded(false);
    
    // Удаляем сессионные куки
    document.cookie = "aether-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("aether-user");
    
    setUser(null);
    setIsSignedIn(false);
    setIsLoaded(true);
    
    router.push("/login");
  };

  return (
    <ClerkContext.Provider value={{ user, isSignedIn, isLoaded, signOut, signIn }}>
      {children}
    </ClerkContext.Provider>
  );
}

export function useUser() {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error("useUser must be used within a ClerkProvider");
  }
  return {
    isSignedIn: context.isSignedIn,
    user: context.user,
    isLoaded: context.isLoaded,
  };
}

export function useAuth() {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error("useAuth must be used within a ClerkProvider");
  }
  return {
    isSignedIn: context.isSignedIn,
    userId: context.user ? context.user.id : null,
    signOut: context.signOut,
    isLoaded: context.isLoaded,
  };
}

export function useSignIn() {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error("useSignIn must be used within a ClerkProvider");
  }

  const signInMethod = async ({ identifier }: { identifier: string }) => {
    await context.signIn(identifier);
  };

  return {
    isLoaded: context.isLoaded,
    signIn: {
      create: signInMethod,
    },
  };
}

export function useSignUp() {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error("useSignUp must be used within a ClerkProvider");
  }

  const signUpMethod = async ({ emailAddress, firstName }: { emailAddress: string; firstName: string }) => {
    await context.signIn(emailAddress, firstName);
  };

  return {
    isLoaded: context.isLoaded,
    signUp: {
      create: signUpMethod,
    },
  };
}
