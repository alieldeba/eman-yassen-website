import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useMutation } from "@tanstack/react-query";
import axios from "../lib/axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { sendError } from "../lib/utils";

function Filters({
  setSearch,
  showUnsubscribed,
  setShowUnsubscribed,
  showRest,
  setShowRest,
  filterStudents,
  setFilterStudents,
  percent,
  setPercent,
  refetch,
  groupId,
}) {
  const [password, setPassword] = useState();

  const resetSubscriptions = useMutation({
    mutationFn: () =>
      axios
        .put(`/groups/${groupId}/reset-subscriptions`, {
          password,
        })
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          sendError(err.response.data.message);
        }),
  });

  const resetMarks = useMutation({
    mutationFn: () =>
      axios
        .put(`/groups/${groupId}/reset-marks`, {
          password,
        })
        .then((res) => {
          toast.success("تم إعادة تعيين درجات الطلاب بنجاح.");
        })
        .catch((err) => {
          sendError(err.response.data.message);
        }),
  });

  const resetAttendance = useMutation({
    mutationFn: () =>
      axios
        .post(`/groups/${groupId}/reset-attendance`, {
          password,
        })
        .then(() => {
          toast.success("تم إعادة تعيين جميع بيانات حضور الطلاب بنجاح.");
        })
        .catch((err) => {
          console.log(err);
          sendError(err.response.data.message);
        }),
  });

  return (
    <section>
      <div className="flex justify-between items-center flex-wrap gap-5">
        <div className="flex flex-col gap-2">
          <div className="relative w-[200px] md:w-[230px] lg:w-[400px] h-fit flex justify-between">
            <Input
              className="pr-10"
              placeholder="البحث عن الطلاب"
              maxLength="60"
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 xl:mr-2 absolute right-2 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <div className="flex gap-2">
            <Select
              defaultValue="all"
              value={filterStudents}
              onValueChange={(value) => setFilterStudents(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">جميع الطلاب</SelectItem>
                  <SelectItem value="greater">جميع الطلاب فوق</SelectItem>
                  <SelectItem value="smaller">جميع الطلاب تحت </SelectItem>
                  <SelectItem value="greaterorequal">
                    جميع الطلاب فوق او يساوون
                  </SelectItem>
                  <SelectItem value="smallerorequal">
                    جميع الطلاب تحت او يساوون
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="number"
              max="100"
              min="0"
              value={percent}
              onChange={(e) => {
                setPercent(e.target.value);
              }}
              placeholder="%"
              className="min-w-[50px] max-w-[80px] text-center"
            />
          </div>
          <Button onClick={() => refetch()}>إعادة تحميل الطلاب</Button>
        </div>
        <div className="flex flex-col gap-2 items-center justify-between">
          <div className="flex gap-2 items-center justify-start w-full">
            <Switch
              checked={showUnsubscribed}
              onClick={() => {
                if (showRest && !showUnsubscribed) {
                  setShowRest(false);
                }
                setShowUnsubscribed(!showUnsubscribed);
              }}
            />
            <label className="font-medium text-xs">المتأخرون عن الدفع</label>
          </div>
          <div className="flex gap-2 items-center justify-start w-full">
            <Switch
              checked={showRest}
              onClick={() => {
                if (showUnsubscribed && !showRest) {
                  setShowUnsubscribed(false);
                }
                setShowRest(!showRest);
              }}
            />
            <label className="font-medium text-xs">الباقي من الدفع</label>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Dialog>
            <DialogTrigger>
              <Button variant="destructive" className="w-[200px]">
                إعادة تعيين دفع الشهر
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إعادة تعيين دفع الشهر</DialogTitle>
                <DialogDescription>
                  سيؤدي هذا القرار إلى إعادة تعيين خانة دفع الشهر لجميع الطلاب
                  في هذه المجموعة إلى عد الدفع ولا يمكنك التراجع عن هذا القرار.
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
              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={() => resetSubscriptions.mutate()}
                >
                  تأكيد
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button variant="destructive" className="w-[200px]">
                إعادة تعيين درجات الطلاب
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إعادة تعيين درجات الطلاب</DialogTitle>
                <DialogDescription>
                  سيؤدي هذا القرار إلى إعادة تعيين جميع درجات الطلاب و حذف جميع
                  درجاتهم فى هذه المجموعة و لا يمكن التراجع عن هذا القرار.
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
                <Button className="w-full" onClick={() => resetMarks.mutate()}>
                  تأكيد
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button variant="destructive" className="w-[200px]">
                إعادة تعيين حضور الطلاب
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إعادة تعيين حضور الطلاب</DialogTitle>
                <DialogDescription>
                  سيؤدي هذا القرار إلى إعادة تعيين جميع حضور الطلاب و حذف جميع
                  بيانات حضورهم فى هذه المجموعة و لا يمكن التراجع عن هذا القرار.
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
                  onClick={() => resetAttendance.mutate()}
                >
                  تأكيد
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Filters);
