import { Separator } from "./ui/separator";
import dayjs from "dayjs";

function PrintUnsubscribedStudents({ students, group }) {
  return (
    <div className="hidden w-full print-show">
      <div className="flex justify-between mx-10">
        <span>{dayjs(new Date()).format("YYYY-MM-DD")}</span>
        <span>{dayjs(new Date()).format("MMMM")}</span>
      </div>
      {students &&
        students.filter((student) => {
          return student.subscription.isSubscribed === false;
        }).length > 0 && (
          <>
            <h3 className="text-center text-lg underline my-3 font-semibold">
              أسماء الطلاب الذين لم يسددو فلوس الشهر فى {group?.title}
            </h3>
            <section className="w-full grid grid-cols-4">
              {students &&
                students
                  .filter((student) => {
                    return student.subscription.isSubscribed === false;
                  })
                  .map((student) => (
                    <span key={student._id} className="my-1 text-center">
                      {student.name}
                    </span>
                  ))}
            </section>
          </>
        )}
      {students &&
        students.filter((student) => {
          return student.subscription.isSubscribed === false;
        }).length > 0 &&
        students.filter((student) => {
          return (
            student.subscription.price &&
            student.subscription.price - student.subscription.studentPayment !==
              0
          );
        }).length > 0 && <Separator />}
      {students &&
        students.filter((student) => {
          return (
            student.subscription.price &&
            student.subscription.price - student.subscription.studentPayment !==
              0
          );
        }).length > 0 && (
          <h3 className="text-center text-lg underline my-5 font-semibold">
            أسماء الطلاب الذين لديهم او عليهم باقى فى {group?.title}
          </h3>
        )}

      <section className="px-24">
        {students &&
          students
            .filter((student) => {
              return (
                student.subscription.price &&
                student.subscription.price -
                  student.subscription.studentPayment !==
                  0
              );
            })
            .map((student) => (
              <div
                key={student._id}
                className="my-3 text-center flex justify-between"
              >
                <span className="text-center">{student.name + " "}</span>
                <span className="text-center"></span>
                <span className="text-center">
                  {student.subscription.price -
                    student.subscription.studentPayment >
                  0
                    ? "الباقى للمعلم" +
                      " " +
                      (student.subscription.price -
                        student.subscription.studentPayment) +
                      "ج"
                    : "الباقى للطالب" +
                      " " +
                      (student.subscription.studentPayment -
                        student.subscription.price) +
                      "ج"}
                </span>
              </div>
            ))}
      </section>
    </div>
  );
}

export default PrintUnsubscribedStudents;
