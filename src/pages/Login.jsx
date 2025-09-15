import Cookies from "universal-cookie";
import { Button } from "../components/ui/button";
import ButtonLoading from "../components/ButtonLoading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { sendError } from "../lib/utils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const cookies = new Cookies();

  const login = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();

      await axios
        .post(`/auth/login`, {
          username,
          password,
        })
        .then((res) => {
          toast.success("تم تسجيل الدخول بنجاح.");
          // Set expiration cookie for 1 year from now
          cookies.set("token", res.data.token, {
            expires: new Date(Date.now() + 31536000000),
          });
          location.replace("/");
        })
        .catch((err) => {
          sendError(err.response.data.message);
        });
    },
  });

  return (
    <form
      className="w-full h-[calc(100vh-200px)] flex items-center justify-center"
      onSubmit={(e) => login.mutate(e)}
    >
      <Card className="w-full max-w-sm rounded">
        <CardHeader>
          <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
          <CardDescription className="text-center">
            ادخل بياناتك لبدء استخدام التطبيق
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">المستخدم</Label>
            <Input
              id="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </CardContent>
        <CardFooter>
          {login.isPending ? (
            <ButtonLoading />
          ) : (
            <Button className="w-full">تسجيل الدخول</Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
