import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "../lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ButtonLoading from "../components/ButtonLoading";

export default function AddPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  const addPassword = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();

      await axios
        .post(`/admin`, {
          username,
          password,
          password_confirmation: repeatPassword,
        })
        .then((res) => {
          toast.success("تم إضافة كلمة المرور بنجاح.");
          navigate("/");
        })
        .catch((err) => {
          sendError(err.response.data.message);
        });
    },
  });

  return (
    <main className="w-full h-[calc(100vh-150px)] flex justify-center items-center">
      <section className="border w-[450px] p-5 rounded">
        <form
          className="w-full flex flex-col gap-5 m-auto"
          onSubmit={(e) => addPassword.mutate(e)}
        >
          <h3 className="text-2xl text-center font-bold">إضافة كلمة المرور</h3>
          <Separator className="border" />
          <div className="flex flex-col gap-2 w-full">
            <h3>اسم المستخدم</h3>
            <Input
              type="text"
              className="text-black rounded-sm text-inherit"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h3>كلمة المرور</h3>
            <Input
              type="password"
              placeholder="************"
              className="text-black rounded-sm text-inherit"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h3>تأكيد كلمة المرور</h3>
            <Input
              type="password"
              placeholder="************"
              className="text-black rounded-sm text-inherit"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
          {addPassword.isPending ? (
            <ButtonLoading />
          ) : (
            <Button className="w-full">إضافة</Button>
          )}
        </form>
      </section>
    </main>
  );
}
