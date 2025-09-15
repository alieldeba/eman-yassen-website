import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import axios from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Filters from "@/components/Filters";
import GroupsButton from "@/components/GroupsButton";
import Loader from "@/components/Loader";
import PrintUnsubscribedStudents from "@/components/PrintUnsubscribedStudents";
import StudentsTable from "@/components/StudentsTable";
import { useReactToPrint } from "react-to-print";
import PrintGroupMarks from "@/components/PrintGroupMarks";
import { File, Printer, QrCode } from "lucide-react";
import PrintStudentAttendance from "@/components/PrintStudentAttendance";
import PaymentReceipts from "../components/PaymentReceipts";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import PrintBarcodes from "../components/PrintBarcodes";
import { grades } from "@/constants";

function GroupDetails() {
  const [studentId, setStudentId] = useState("");
  const [search, setSearch] = useState("");
  const [showUnsubscribed, setShowUnsubscribed] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [filterStudents, setFilterStudents] = useState("all");
  const [percent, setPercent] = useState("");

  const [paymentReceiptsDates, setPaymentReceiptsDates] = useState([]);

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return dayjs(date).format("dddd D MMMM YYYY");
  });

  const currentGroupId =
    location.href.split("/")[location.href.split("/").length - 1];

  const students = useQuery({
    queryKey: ["groups", "students", currentGroupId],
    queryFn: async () => {
      // Get all students in this group (no mark filters)
      if (!filterStudents || !percent || filterStudents === "all") {
        return await axios
          .get(`/groups/${currentGroupId}/students`)
          .then((res) => res.data);
      }

      return await axios
        .get(
          `/groups/${currentGroupId}/students?filter=${filterStudents}&percent=${percent}`
        )
        .then((res) => res.data);
    },
  });

  const { data: group } = useQuery({
    queryKey: ["groups", currentGroupId],
    queryFn: () =>
      axios.get(`/groups/${currentGroupId}`).then((res) => res.data),
  });

  const deleteStudent = useMutation({
    mutationFn: () =>
      axios
        .delete(`/students/${studentId}`)
        .then(() => {
          toast.success("تم حذف الطالب بنجاح.");
          students.refetch();
        })
        .catch((err) => {
          console.log(err);
          toast.error("خطأ داخلى فى السيرفر.");
        }),
  });

  const studentsMarks = useRef(null);
  const printStudentsMarks = useReactToPrint({
    content: () => studentsMarks.current,
  });

  const unsubscribedStudents = useRef(null);
  const printUnsubscribedStudents = useReactToPrint({
    content: () => unsubscribedStudents.current,
  });

  const studentsAttendance = useRef(null);
  const printStudentsAttendance = useReactToPrint({
    content: () => studentsAttendance.current,
  });

  const receipts = useRef(null);
  const printReceipts = useReactToPrint({
    content: () => receipts.current,
  });

  const barcodes = useRef(null);
  const printBarcodes = useReactToPrint({
    content: () => barcodes.current,
  });

  return (
    <>
      <div className="absolute left-5 top-5 flex gap-2">
        <GroupsButton />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-[6.8rem] right-5 focus-visible:ring-0 p-1.5 cursor-pointer gap-3 overflow-hidden hover:w-fit group"
        onClick={printStudentsAttendance}
        disabled={students.isFetching || students?.data?.length === 0}
      >
        <Printer size={20} strokeWidth={1.5} />
        <span className="hidden group-hover:block">طباعة سجل حضور الطلاب</span>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="focus-visible:ring-0 p-1.5 absolute top-[9.6rem] right-5 cursor-pointer gap-3 overflow-hidden hover:w-fit group"
            disabled={!students.data || !group}
          >
            <File size={20} strokeWidth={1.5} />
            <span className="hidden group-hover:block">
              طباعة استمارات الدفع
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>طباعة استمارات دفع الطلاب</DialogTitle>
            <DialogDescription>
              قم بتحديد ايام التواريخ التي تريد طباعة استمارات الطلاب بها.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {days.map((day, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  id={`day-${idx}`}
                  checked={paymentReceiptsDates.includes(day)}
                  onCheckedChange={(checked) =>
                    checked
                      ? setPaymentReceiptsDates((prev) => [...prev, day])
                      : setPaymentReceiptsDates((prev) =>
                          prev.filter((d) => d !== day)
                        )
                  }
                />
                <label
                  htmlFor={`day-${idx}`}
                  className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={printReceipts} className="w-full">
              طباعة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <Button
        variant="outline"
        size="icon"
        className="focus-visible:ring-0 p-1.5 absolute top-[12.4rem] right-5 cursor-pointer gap-3 overflow-hidden hover:w-fit group"
        onClick={printBarcodes}
        disabled={!students.data || !group}
      >
        <QrCode size={20} strokeWidth={1.5} />
        <span className="hidden group-hover:block">طباعة أكواد الطلاب</span>
      </Button> */}
      <div className="print-none mx-auto mb-5 max-w-screen-xl px-4 md:px-8">
        <div className="students-start justify-between md:flex">
          <div className="max-w-lg">
            <span className="text-sm">{grades[group?.grade]}</span>
            <h3 className="truncate text-xl font-bold sm:text-2xl xl:overflow-visible">
              طلاب {group?.title || "..."} (
              {students.data ? students.data.length : "0"})
            </h3>
            <p className="mt-2 text-muted-foreground">
              جميع الطلاب الذين تم إضافتهم فى هذه المجموعة عن طريق المعلم و
              مساعديه.
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <Button
              className="inline-block rounded-lg px-4 py-2 font-semibold duration-150 md:text-sm"
              disabled={!group || students.isFetching}
            >
              <Link to={`/groups/${currentGroupId}/new`}>إضافة طالب</Link>
            </Button>
          </div>
        </div>
        <Button
          variant="secondary"
          className="mb-2 mt-2"
          onClick={printStudentsMarks}
          disabled={students.isFetching || students?.data?.length == 0}
        >
          طباعة درجات الطلاب
        </Button>
        <Button
          variant="secondary"
          className="mb-2 lg:mr-3"
          onClick={printUnsubscribedStudents}
          disabled={students.isFetching || students?.data?.length == 0}
        >
          طباعة الطلاب غير مسددين الشهر
        </Button>
        <Filters
          setSearch={setSearch}
          showUnsubscribed={showUnsubscribed}
          setShowUnsubscribed={setShowUnsubscribed}
          showRest={showRest}
          setShowRest={setShowRest}
          filterStudents={filterStudents}
          setFilterStudents={setFilterStudents}
          percent={percent}
          setPercent={setPercent}
          refetch={students.refetch}
          groupId={currentGroupId}
        />
        {students?.data?.length == 0 && (
          <div className="mt-24">
            <p className="text-center">لا يوجد طلاب في هذه المجموعة</p>
          </div>
        )}
        {students.isFetched && students.data && students.data.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-lg border shadow-sm">
            <AlertDialog>
              <table className="w-full table-auto text-right text-sm">
                <thead className="border-b font-medium">
                  <tr>
                    <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                      المعرف
                    </th>
                    <th className="px-6 py-3 text-center hover:bg-muted transition-colors border">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-center hover:bg-muted transition-colors border min-w-[180px]">
                      رقم الطالب
                    </th>
                    <th className="px-6 py-3 text-center hover:bg-muted transition-colors border min-w-[180px]">
                      رقم ولى الأمر
                    </th>
                    <th className="px-6 py-3 text-center hover:bg-muted transition-colors border min-w-[150px]">
                      دفع الشهر
                    </th>
                    <th className="px-6 py-3 pr-[120px] hover:bg-muted transition-colors border w-[420px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.data && !students.isFetching && (
                    <StudentsTable
                      students={students.data}
                      search={search}
                      showUnsubscribed={showUnsubscribed}
                      showRest={showRest}
                      setStudentId={setStudentId}
                    />
                  )}
                </tbody>
              </table>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex justify-start">
                    هل انت متأكد؟
                  </AlertDialogTitle>
                  <AlertDialogDescription className="rtl text-right">
                    سيؤدى هذا القرار الى حذف الطالب من مجموعتك و سوف يفقد جميع
                    درجاته و معلوماته داخل مجموعتك.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="block justify-end gap-2">
                  <AlertDialogAction
                    className="ml-2"
                    onClick={() => deleteStudent.mutate()}
                  >
                    متابعة
                  </AlertDialogAction>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {students.isFetching && <Loader className="mt-24" />}
      </div>
      {students.data && (
        <>
          <main ref={studentsMarks} className="print-show hidden w-full">
            <PrintGroupMarks students={students.data} />
          </main>
          <main ref={unsubscribedStudents}>
            <PrintUnsubscribedStudents students={students.data} group={group} />
          </main>
          <main ref={studentsAttendance} className="print-show hidden w-full">
            <PrintStudentAttendance
              students={students.data}
              group={group?.title}
            />
          </main>
          {students.data && group && (
            <div ref={receipts}>
              <PaymentReceipts
                group={group?.title}
                students={students.data.filter(
                  (student) => student.subscription.isSubscribed === true
                )}
              />
            </div>
          )}
          {students.data && group && (
            <div ref={receipts}>
              <PaymentReceipts
                group={group?.title}
                students={students.data.filter(
                  (student) =>
                    student.subscription.isSubscribed === true &&
                    paymentReceiptsDates.includes(
                      dayjs(student.subscription.paymentDate).format(
                        "dddd D MMMM YYYY"
                      )
                    )
                )}
              />
            </div>
          )}

          {students.data && (
            <div ref={barcodes}>
              <PrintBarcodes students={students.data} />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default React.memo(GroupDetails);
