import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendError(err: string | string[]) {
  switch (typeof err) {
    case "string":
      toast.error(err);
      break;
    case "object":
      toast.error(err[0]);
      break;
    default:
      toast.error("عذرا حدث خطأ.");
  }
  console.error(err);
}

export function getAverageMark(student: Student): number {
  return (
    (student.marks
      .map((mark) => mark.studentMark)
      .reduce((acc, curr) => acc + curr, 0) /
      student.marks
        .map((mark) => mark.maxMark)
        .reduce((acc, curr) => acc + curr, 0)) *
    100
  );
}
