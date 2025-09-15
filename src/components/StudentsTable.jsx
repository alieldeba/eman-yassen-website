import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import { Check, HelpCircle, X, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AlertDialogTrigger } from "./ui/alert-dialog";
import inhanceSearch from "../lib/inhanceSearch";

function StudentsTable({
  students,
  search,
  showUnsubscribed,
  showRest,
  setStudentId,
}) {
  return (
    <>
      {students
        .filter((student) => {
          if (showUnsubscribed)
            return (
              inhanceSearch(student.name).includes(inhanceSearch(search)) &&
              student?.subscription?.isSubscribed === false
            );
          if (showRest) {
            return (
              inhanceSearch(student.name).includes(inhanceSearch(search)) &&
              student?.subscription?.isSubscribed === true &&
              student?.subscription?.price -
                student?.subscription?.studentPayment !==
                0
            );
          }
          return inhanceSearch(student.name).includes(inhanceSearch(search));
        })
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
                                student?.subscription?.studentPayment >
                              0 ? (
                                <p>
                                  <span className="font-bold text-primary">
                                    المتبقى للمعلم:
                                  </span>{" "}
                                  {student?.subscription?.price -
                                    student?.subscription?.studentPayment}
                                  ج
                                </p>
                              ) : (
                                <p>
                                  <span className="font-bold text-primary">
                                    المتبقى للطالب:
                                  </span>{" "}
                                  {student?.subscription?.studentPayment -
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
                            {dayjs(student?.subscription?.paymentDate).format(
                              "dddd D MMMM YYYY"
                            )}
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
                <Button variant="outline" className="ml-2">
                  تقرير الطالب
                </Button>
              </Link>
              <Link to={`/students/${student._id}/edit`}>
                <Button variant="secondary" className="ml-2">
                  تعديل
                </Button>
              </Link>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => setStudentId(student._id)}
                >
                  حذف
                </Button>
              </AlertDialogTrigger>
            </td>
          </tr>
        ))}
    </>
  );
}

export default StudentsTable;
