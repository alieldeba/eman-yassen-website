import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router";
import React, { useState } from "react";
import axios from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import DatePicker from "@/components/DatePicker";
import Loader from "@/components/Loader";
import ButtonLoading from "@/components/ButtonLoading";
import { sendError } from "@/lib/utils";
import GroupsButton from "@/components/GroupsButton";

function EditStudent() {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState();

  const [paymentDate, setPaymentDate] = useState("");

  const currentStudentId =
    location.href.split("/")[location.href.split("/").length - 2];

  useQuery({
    queryKey: ["students", currentStudentId],
    queryFn: () =>
      axios
        .get(`/students/${currentStudentId}`)
        .then((student) =>
          setStudentData({ ...student.data, group: student.data.group._id })
        ),
  });

  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get("/groups")
        .then((res) => res.data)
        .catch((err) => {
          sendError(err.response.data.message);
        }),
  });

  const updateStudent = useMutation({
    mutationFn: async () => {
      if (!studentData?.phone) delete studentData.phone;
      if (!studentData?.parent_phone) delete studentData.parent_phone;

      await axios
        .patch(`/students/${currentStudentId}`, {
          phone: null,
          parent_phone: null,
          ...studentData,
        })
        .then(() => {
          toast.success("تم تحديث بيانات الطالب بنجاح");
          navigate(`/groups/${studentData?.group}`);
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
      {studentData?.name ? (
        <main className="w-full h-[calc(100vh-150px)] flex justify-center items-center">
          <section className="grid items-center gap-8 pb-8 pt-6 md:py-8 container max-w-lg">
            <div className="rounded-lg border border-dark bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col p-6 space-y-1 text-center">
                <h3 className="tracking-tight text-2xl font-bold">
                  تعديل طالب
                </h3>
              </div>
              <div className="p-6 pt-0 grid gap-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-dark"></span>
                  </div>
                </div>
                <form
                  className="grid gap-4"
                  autoComplete="off"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      الاسم
                    </label>
                    <Input
                      type="text"
                      placeholder="محمد أحمد"
                      name="name"
                      maxLength={30}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          name: e.target.value,
                        })
                      }
                      value={studentData.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      رقم التليفون
                    </label>
                    <Input
                      type="text"
                      name="phone"
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          phone: e.target.value,
                        })
                      }
                      value={studentData.phone}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      رقم ولى الأمر
                    </label>
                    <Input
                      type="text"
                      name="telephone"
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          parent_phone: e.target.value,
                        })
                      }
                      value={studentData.parent_phone}
                    />
                  </div>
                  {groups && studentData?.group && (
                    <Select
                      onValueChange={(value) =>
                        setStudentData({
                          ...studentData,
                          group: groups.filter(
                            (group) => group?.title === value
                          )[0]._id,
                        })
                      }
                      defaultValue={
                        groups.filter(
                          (group) => group._id === studentData.group
                        )[0].title
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="أختر مجموعة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>المجموعات</SelectLabel>
                          {groups &&
                            groups.map(({ _id, title }) => (
                              <SelectItem key={_id} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  <div className="flex gap-5 items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                      <label className="font-medium">دفع الشهر</label>
                      <Switch
                        checked={studentData.subscription.isSubscribed}
                        onClick={() =>
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData.subscription,
                              isSubscribed:
                                !studentData.subscription.isSubscribed,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      studentData.subscription.isSubscribed
                        ? "max-h-[1000px]"
                        : "max-h-0 overflow-clip"
                    } transition-all duration-300`}
                  >
                    <DatePicker
                      date={paymentDate || studentData.subscription.paymentDate}
                      setDate={setPaymentDate}
                      placeholder="تحديد تاريخ الدفع"
                    />
                    <div className="flex pt-3">
                      <Input
                        type="number"
                        min={1}
                        value={studentData.subscription.studentPayment || ""}
                        placeholder="فلوس الطالب"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData.subscription,
                              studentPayment: e.target.value,
                            },
                          })
                        }
                        step="any"
                        onKeyDown={(e) => {
                          if ([69, 187, 188, 189].includes(e.keyCode)) {
                            e.preventDefault();
                          }
                        }}
                        className="rounded-l-none text-center"
                      />
                      <span className="px-5 mt-1 text-foreground-muted">
                        من
                      </span>
                      <Input
                        type="number"
                        min={1}
                        value={studentData.subscription.price || ""}
                        placeholder="فلوس الشهر"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData.subscription,
                              price: e.target.value,
                            },
                          })
                        }
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
                  {updateStudent.isPending ? (
                    <ButtonLoading />
                  ) : (
                    <Button
                      onClick={() => {
                        if (paymentDate) {
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData.subscription,
                              paymentDate,
                            },
                          });
                        }
                        updateStudent.mutate();
                      }}
                    >
                      تحديث
                    </Button>
                  )}
                </form>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <Loader className="mt-80" />
      )}
    </>
  );
}

export default React.memo(EditStudent);
