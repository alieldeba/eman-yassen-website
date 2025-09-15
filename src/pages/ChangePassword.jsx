import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "../lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ButtonLoading from "../components/ButtonLoading";
import { sendError } from "../lib/utils";

export default function ChangePassword() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const navigate = useNavigate();

  const changePassword = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();

      await axios
        .put(`/admin`, {
          username,
          old_password: oldPassword,
          new_password: newPassword,
          password_confirmation: repeatNewPassword,
        })
        .then((res) => {
          toast.success("تم تغيير كلمة المرور بنجاح.");
          navigate("/");
        })
        .catch((err) => {
          sendError(err.response.data.message);
        });
    },
  });

  return (
    <main className="w-full h-[calc(100vh-150px)] flex justify-center items-center">
      <section className="border w-[450px] p-5 rounded-md">
        <form
          className="w-full flex flex-col gap-5 m-auto rounded-md"
          onSubmit={(e) => changePassword.mutate(e)}
        >
          <h3 className="text-2xl text-center font-bold">تغيير كلمة المرور</h3>
          <Separator className="border" />
          <div className="flex flex-col gap-2 w-full">
            <h3>اسم المستخدم الجديد</h3>
            <Input
              type="text"
              className="text-black rounded-sm text-inherit"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h3>كلمة المرور القديمة</h3>
            <Input
              type="password"
              placeholder="************"
              className="text-black rounded-sm text-inherit"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h3>كلمة المرور الجديدة</h3>
            <Input
              type="password"
              placeholder="************"
              className="text-black rounded-sm text-inherit"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h3>تأكيد كلمة المرور الجديدة</h3>
            <Input
              type="password"
              placeholder="************"
              className="text-black rounded-sm text-inherit"
              value={repeatNewPassword}
              onChange={(e) => setRepeatNewPassword(e.target.value)}
            />
          </div>
          {changePassword.isPending ? (
            <ButtonLoading />
          ) : (
            <Button className="w-full">تحديث</Button>
          )}
        </form>
      </section>
    </main>
  );
}
