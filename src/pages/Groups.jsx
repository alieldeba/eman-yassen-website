import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";
import axios from "../lib/axios";
import { Button } from "../components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "../components/ui/input";
import Loader from "../components/Loader";
import Cookies from "universal-cookie";
import { grades } from "@/constants";

function Groups() {
  const cookie = new Cookies();
  const [groupId, setGroupId] = useState();
  const [password, setPassword] = useState();

  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get("/groups")
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          toast.error("حدث خطأ داخلى فى السيرفر.");
        }),
  });

  const deleteGroup = useMutation({
    mutationFn: (groupId) =>
      axios
        .delete(`/groups/${groupId}`, {
          data: {
            password,
          },
        })
        .then(() => {
          toast.success("تم حذف المجموعة بنجاح.");
          groups.refetch();
          setPassword("");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        }),
  });

  return (
    <>
      <main>
        <Button
          className="absolute top-5 left-5"
          variant="destructive"
          onClick={() => {
            cookie.remove("token");
            location.replace("/login");
          }}
        >
          تسجيل الخروج
        </Button>
        <Dialog>
          <h1 className="mb-12 text-4xl lg:text-5xl font-bold text-center">
            سيستم أ/إيمان ياسين
          </h1>
          <section className="flex flex-wrap justify-center gap-2 mb-5">
            {groups.data && !groups.isLoading ? (
              groups.data.map((group, idx) => {
                return (
                  <div className="relative" key={group._id}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="absolute top-0 right-0 p-2 rounded transition-all bg-transparent hover:bg-destructive"
                        onClick={() => setGroupId(group._id)}
                      >
                        <Trash2 size={16} strokeWidth={1} absoluteStrokeWidth />
                      </Button>
                    </DialogTrigger>
                    <Link to={`/groups/${group._id}/edit`}>
                      <Button
                        variant="ghost"
                        className="absolute top-8 right-0 p-2 rounded transition-all bg-transparent"
                      >
                        <Pencil size={16} strokeWidth={1} absoluteStrokeWidth />
                      </Button>
                    </Link>
                    <Link
                      to={`/groups/${group._id}`}
                      key={idx}
                      className="w-[280px] h-[240px] border flex items-center justify-center px-3 transition-all rounded-md"
                    >
                      <p className="text-lg text-center break-words overflow-hidden">
                        {group.title}
                      </p>
                      <p className="text-xs absolute bottom-2">
                        {grades[group.grade]}
                      </p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <Loader className="mt-24">جارى عرض المجموعات ...</Loader>
            )}
            {!groups.isLoading && !groups.isError && (
              <Link
                to="/groups/new"
                className="w-[280px] h-[240px] border flex gap-2 font-semibold items-center justify-center px-3 border-dashed rounded-md"
              >
                <Plus size={46} strokeWidth={2} absoluteStrokeWidth />
              </Link>
            )}
          </section>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>حذف المجموعة</DialogTitle>
              <DialogDescription>
                سيؤدي هذا القرار إلى حذف هذه المجموعة من قائمة مجموعاتك و سوف
                تفقد جميع بيانات هذه المجموعة للأبد.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                كلمة المرور
              </label>
              <Input
                type="password"
                placeholder="************"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                maxLength={50}
              />
            </div>
            <DialogClose>
              <Button
                className="w-full"
                onClick={() => deleteGroup.mutate(groupId)}
              >
                تأكيد
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default React.memo(Groups);
