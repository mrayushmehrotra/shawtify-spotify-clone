"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";
import Modal from "./Modal";

const AuthModal = () => {
  const { session } = useSessionContext();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Guest Login Function
  const handleGuestLogin = async () => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: "demo@gmail.com",
      password: "demodemo",
    });

    if (error) {
      console.error("Guest Login Failed:", error.message);
    } else {
      console.log("Guest Login Success:", data);
      router.refresh();
      onClose();
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account."
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <p>
            Email: <strong>demo@gmail.com</strong>
          </p>
          <p>
            Password: <strong>demodemo</strong>
          </p>
        </div>
        <button
          onClick={handleGuestLogin}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Guest Login
        </button>
      </div>

      <Auth
        supabaseClient={supabaseClient}
        providers={["github"]}
        magicLink={true}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#22c55e",
              },
            },
          },
        }}
        theme="dark"
      />
    </Modal>
  );
};

export default AuthModal;
