import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ButtonLoading from "@/components/ButtonLoading";
import { sendError } from "@/lib/utils";
import GroupsButton from "../components/GroupsButton";

function AddMark() {
  const [studentMark, setStudentMark] = useState();
  const [maxMark, setMaxMark] = useState();
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const currentStudentId =
    location.href.split("/")[location.href.split("/").length - 3];

  const addMark = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();

      await axios
        .post(`/marks`, {
          student: currentStudentId,
          studentMark,
          maxMark,
          date: date,
        })
        .then(() => {
          toast.success("تم إضافة الدرجة للطالب بنجاح");
          navigate(`/students/${currentStudentId}/marks`);
        })
        .catch((err) => {
          sendError(err.response.data.message);
        });
    },
  });

  return (
    <>
    <div className="flex gap-2 absolute left-5 top-5">
        <GroupsButton />
      </div>
      <main className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
        <section className="grid items-center gap-8 pb-8 pt-6 md:py-8 container max-w-lg">
          <div className="rounded-lg border border-dark bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col p-6 space-y-1 text-center">
              <h3 className="tracking-tight text-2xl font-bold">إضافة درجة</h3>
            </div>
            <div className="p-6 pt-0 grid gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-dark" />
                </div>
              </div>
              <form
                className="grid gap-4"
                autoComplete="off"
                onSubmit={(e) => addMark.mutate(e)}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    درجة الإمتحان
                  </label>
                  <br />
                  <div className="flex">
                    <Input
                      type="number"
                      min={0}
                      value={studentMark}
                      placeholder="درجة الطالب"
                      onChange={(e) => setStudentMark(e.target.value)}
                      step="any"
                      onKeyDown={(e) => {
                        if ([69, 187, 188, 189].includes(e.keyCode)) {
                          e.preventDefault();
                        }
                      }}
                      className="rounded-l-none text-center"
                    />
                    <span className="px-5 mt-1 text-foreground-muted">من</span>
                    <Input
                      type="number"
                      min={1}
                      value={maxMark}
                      placeholder="درجة الإمتحان"
                      onChange={(e) => setMaxMark(e.target.value)}
                      step="any"
                      onKeyDown={(e) => {
                        if ([69, 187, 188, 189].includes(e.keyCode)) {
                          e.preventDefault();
                        }
                      }}
                      className="rounded-r-none text-center"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    تاريخ الإمتحان
                  </label>
                  <br />
                  <DatePicker date={date} setDate={setDate} />
                </div>
                {addMark.isPending ? <ButtonLoading /> : <Button>إضافة</Button>}
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default React.memo(AddMark);
