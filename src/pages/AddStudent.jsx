import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GroupsButton from "@/components/GroupsButton";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ButtonLoading from "@/components/ButtonLoading";
import DatePicker from "@/components/DatePicker";
import { sendError } from "@/lib/utils";
import Loader from "@/components/Loader";

function CreateStudent() {
  const navigate = useNavigate();

  const currentGroupId =
    location.href.split("/")[location.href.split("/").length - 2];

  const [studentData, setStudentData] = useState();

  const [paymentDate, setPaymentDate] = useState();

  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: async () =>
      await axios
        .get("/groups")
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          toast.error("حدث خطأ أثناء إيجاد المجموعات");
        }),
  });

  const { data: currentGroup } = useQuery({
    queryKey: ["groups", currentGroupId],
    queryFn: async () =>
      await axios
        .get(`/groups/${currentGroupId}`)
        .then((res) => {
          setStudentData({
            ...studentData,
            group: res.data._id,
          });
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          toast.error("حدث خطأ أثناء إيجاد المجموعة");
        }),
  });

  const createStudent = useMutation({
    mutationFn: async () => {
      if (!studentData.phone) delete studentData.phone;
      if (!studentData.parent_phone) delete studentData.parent_phone;

      await axios
        .post("/students", studentData)
        .then(() => {
          toast.success("تم إضافة الطالب للمجموعة بنجاح");
          navigate(`/groups/${studentData.group}`);
        })
        .catch((err) => {
          sendError(err.response.data.message);
        });
    },
  });

  return (
    <>
      <div className="absolute left-5 top-5 flex gap-2">
        <GroupsButton />
      </div>
      {currentGroup && groups ? (
        <main className="flex h-[calc(100vh-150px)] w-full items-center justify-center">
          <section className="container grid max-w-lg items-center gap-8 pb-8 pt-6 md:py-8">
            <div className="border-dark rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1 p-6 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  إضافة طالب
                </h3>
              </div>
              <div className="grid gap-4 p-6 pt-0">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="border-dark w-full border-t"></span>
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
                      value={studentData?.name}
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
                      value={studentData?.phone}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      رقم ولى الأمر
                    </label>
                    <Input
                      type="text"
                      name="parent_phone"
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          parent_phone: e.target.value,
                        })
                      }
                      value={studentData?.parent_phone}
                    />
                  </div>
                  {currentGroup && groups && (
                    <Select
                      onValueChange={(value) =>
                        setStudentData({
                          ...studentData,
                          group: groups.filter(
                            (group) => group.title === value
                          )[0]._id,
                        })
                      }
                      defaultValue={currentGroup?.title}
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
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex w-full items-center justify-between">
                      <label className="font-medium">دفع الشهر</label>
                      <Switch
                        checked={studentData?.subscription?.isSubscribed}
                        onClick={() =>
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData?.subscription,
                              isSubscribed:
                                !studentData?.subscription?.isSubscribed,
                              price: studentData?.subscription?.price || null,
                              studentPayment:
                                studentData?.subscription?.studentPayment ||
                                null,
                              paymentDate: paymentDate || null,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      studentData?.subscription?.isSubscribed
                        ? "max-h-[1000px]"
                        : "max-h-0 overflow-clip"
                    } transition-all duration-300`}
                  >
                    <DatePicker
                      date={paymentDate}
                      setDate={setPaymentDate}
                      placeholder="تحديد تاريخ الدفع"
                    />
                    <div className="flex pt-3">
                      <Input
                        type="number"
                        min={1}
                        value={studentData?.subscription?.studentPayment || ""} // Ensure value is a string
                        placeholder="فلوس الطالب"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData?.subscription,
                              isSubscribed: true,
                              price: studentData?.subscription?.price || null,
                              paymentDate: paymentDate || null,
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
                      <span className="text-foreground-muted mt-1 px-5">
                        من
                      </span>
                      <Input
                        type="number"
                        min={1}
                        value={studentData?.subscription?.price || ""} // Ensure value is a string
                        placeholder="فلوس الشهر"
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            subscription: {
                              ...studentData?.subscription,
                              isSubscribed: true,
                              studentPayment:
                                studentData?.subscription?.studentPayment ||
                                null,
                              paymentDate: paymentDate || null,
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
                  {createStudent.isPending ? (
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
                        createStudent.mutate();
                      }}
                    >
                      إضافة
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

export default React.memo(CreateStudent);
