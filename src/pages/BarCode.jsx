import { Input } from "@/components/ui/input";
import { Check, HelpCircle, QrCode, X, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { sendError } from "@/lib/utils";
import axios from "../lib/axios";
import { grades } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import GroupsButton from "../components/GroupsButton";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

function BarCode() {
  const inputRef = useRef(null);

  const students = useQuery({
    queryKey: ["students"],
    queryFn: async () =>
      await axios
        .get("/students")
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          toast.error("حدث خطأ أثناء محاولة إيجاد الطلاب الذين حضرو اليوم.");
        }),
  });

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const keepFocus = () => inputEl.focus();
    inputEl.addEventListener("blur", keepFocus);
    inputEl.focus();

    const handleKeyPress = async (e) => {
      if (e.key === "Enter") {
        const studentCode = inputEl.value.trim();
        if (studentCode) {
          await axios
            .post(`/students/${studentCode}`)
            .then((res) => {
              toast.success(`تم تسجيل الحضور إلى ${res.data.name} بنجاح`, {
                description: `كود الطالب/ـة: ${res.data.code} - ${
                  res.data.subscription.isSubscribed ? "مشترك" : "غير مشترك"
                }`,
              });

              students.refetch();
            })
            .catch((err) => {
              sendError(err.response.data.message);
            });

          inputEl.value = "";
        }
      }
    };

    inputEl.addEventListener("keypress", handleKeyPress);

    return () => {
      inputEl.removeEventListener("blur", keepFocus);
      inputEl.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className="flex gap-2 absolute left-5 top-5">
        <GroupsButton />
      </div>
      <main className="flex flex-col gap-5 items-center justify-center h-[calc(100vh-200px)]">
        <QrCode size={230} strokeWidth={1} />
        <p className="text-muted-foreground text-sm">
          قم بمسح الباركود الخاص بالطالب او قم بكتابة الكود الذي يمتلكه الطالب
          لكي يتم تسجيل حضور الطالب في هذا اليوم.
        </p>
        <Input
          ref={inputRef}
          type="text"
          className="w-[200px]"
          placeholder="ادخل الكود الخاص بالطالب"
        />
      </main>

      {students.data?.length > 0 && (
        <section className="mt-10 max-w-9xl mx-auto p-8">
          <h3 className="text-center text-xl">جميع الطلاب الذين حضرو اليوم</h3>
          <div className="mt-3 overflow-x-auto rounded-lg border shadow-sm">
            <table className="w-full table-auto text-right text-sm">
              <thead className="border-b font-medium">
                <tr>
                  <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                    الكود
                  </th>
                  <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                    رقم الطالب
                  </th>
                  <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                    رقم ولى الأمر
                  </th>
                  <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                    المجموعة
                  </th>
                  <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                    دفع الشهر
                  </th>
                  <th className="px-6 py-3 pr-[120px] hover:bg-muted transition-colors border w-[420px]"></th>
                  <th className="px-6 py-3 pr-[120px] hover:bg-muted transition-colors border w-[420px] hidden">
                    الباركود
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.data
                  .filter((student) =>
                    student.attendance.includes(
                      new Date().toLocaleDateString("en-US")
                    )
                  )
                  .map((student) => (
                    <tr key={student._id}>
                      <td className="whitespace-nowrap px-6 py-4 text-center border p-2">
                        {student.code}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center border">
                        {student.name}
                      </td>
                      <td
                        className={`whitespace-nowrap px-2 py-4 text-center ${
                          !student.phone ? "text-muted-foreground" : ""
                        }`}
                      >
                        {student.phone || "فارغ"}
                      </td>

                      <td
                        className={`whitespace-nowrap px-2 py-4 text-center border ${
                          !student.parent_phone ? "text-muted-foreground" : ""
                        }`}
                      >
                        {student.parent_phone || "فارغ"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center border p-2">
                        {student.group.title} - {grades[student.group.grade]}
                      </td>
                      <td className="relative whitespace-nowrap px-2 py-1 border">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full text-xs font-semibold ${
                                student?.subscription?.isSubscribed
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {student?.subscription?.isSubscribed &&
                              student.subscription.price -
                                student.subscription.studentPayment ===
                                0 ? (
                                <Check size={20} strokeWidth={2} />
                              ) : student?.subscription?.isSubscribed &&
                                student?.subscription?.price -
                                  student?.subscription?.studentPayment !==
                                  0 ? (
                                <HelpCircle
                                  size={20}
                                  strokeWidth={2}
                                  className="text-orange-600"
                                />
                              ) : (
                                <X size={20} strokeWidth={2} />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              {student?.subscription?.isSubscribed && (
                                <DialogTitle className="flex justify-start">
                                  بيانات دفع الطالب
                                </DialogTitle>
                              )}
                              <DialogDescription className="rtl text-right">
                                {student?.subscription?.isSubscribed ? (
                                  <section className="text-md flex flex-col gap-5 pt-2">
                                    <p>
                                      <span className="font-bold text-primary">
                                        المدفوع:
                                      </span>{" "}
                                      {student?.subscription?.studentPayment}ج
                                    </p>
                                    <p>
                                      <span className="font-bold text-primary">
                                        حساب الشهر:
                                      </span>{" "}
                                      {student?.subscription?.price}ج
                                    </p>
                                    {student?.subscription?.price -
                                      student?.subscription?.studentPayment !==
                                      0 && (
                                      <>
                                        {student?.subscription?.price -
                                          student?.subscription
                                            ?.studentPayment >
                                        0 ? (
                                          <p>
                                            <span className="font-bold text-primary">
                                              المتبقى للمعلم:
                                            </span>{" "}
                                            {student?.subscription?.price -
                                              student?.subscription
                                                ?.studentPayment}
                                            ج
                                          </p>
                                        ) : (
                                          <p>
                                            <span className="font-bold text-primary">
                                              المتبقى للطالب:
                                            </span>{" "}
                                            {student?.subscription
                                              ?.studentPayment -
                                              student?.subscription?.price}
                                            ج
                                          </p>
                                        )}
                                      </>
                                    )}
                                    <p>
                                      <span className="font-bold text-primary">
                                        توقيت الدفع:
                                      </span>{" "}
                                      {dayjs(
                                        student?.subscription?.paymentDate
                                      ).format("dddd D MMMM YYYY")}
                                    </p>
                                  </section>
                                ) : (
                                  <section className="flex flex-col items-center gap-5">
                                    <XCircle
                                      size={100}
                                      strokeWidth={3}
                                      absoluteStrokeWidth
                                      className="m-auto"
                                    />
                                    <span className="text-lg">
                                      لم يسدد الطالب دفع الشهر
                                    </span>
                                  </section>
                                )}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </td>
                      <td className="whitespace-nowrap px-6 text-center border">
                        <Link to={`/students/${student._id}/marks`}>
                          <Button variant="secondary" className="ml-2">
                            تقرير الطالب
                          </Button>
                        </Link>
                        <Link to={`/students/${student._id}/edit`}>
                          <Button variant="secondary" className="ml-2">
                            تعديل
                          </Button>
                        </Link>
                        {/* <Button
                          variant="secondary"
                          className="ml-2"
                          onClick={() => {
                            // console.log(student.code.toString());
                            setSelectedCode(student.code.toString());
                            printBarcode();
                          }}
                        >
                          طباعة الكود
                        </Button> */}
                        {/* <Button variant="secondary" className="ml-2">
                          طباعة استمارة الدفع
                        </Button> */}
                      </td>
                      {/* <td className="hidden">
                        <div
                          ref={(el) =>
                            (barcodeRefs.current[
                              students.data?.findIndex(
                                (s: Student) => s._id === student._id
                              ) || 0
                            ] = el)
                          }
                          className="print:block hidden"
                        >
                          <PrintBarcode student={student} />
                        </div>
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

export default BarCode;
