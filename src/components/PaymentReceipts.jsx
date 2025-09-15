import dayjs from "dayjs";

function PaymentReceipts({ group, students }) {
  return (
    <main className="grid gap-2 grid-cols-2 grid-rows-3 mx-5">
      {students.map((student, idx) => (
        <div
          className="hidden print-show bg-muted border border-5 border-black rounded relative"
          key={idx}
        >
          <div className="text-5xl font-semibold text-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full opacity-20">
            إيمان ياسين
          </div>
          <div className="flex items-end justify-between p-[7px]">
            <p className="font-bold text-lg">
              الاسم: <span className="font-normal">{student.name}</span>
            </p>
          </div>
          <div className="flex items-end justify-between p-[7px]">
            <p className="font-bold text-lg">
              الشهر:{" "}
              <span className="font-normal">
                {dayjs(student?.subscription?.paymentDate).format("MMMM")}
              </span>
            </p>
          </div>
          <div className="flex items-end justify-between p-[7px]">
            <p className="font-bold text-lg">
              المجموعة:{" "}
              <span className="font-normal text-sm">
                {group.replace(/مجموعة|مجموعه/, "")}
              </span>
            </p>
          </div>
          <div className="flex items-end justify-between p-[7px]">
            <p className="font-bold text-lg">
              التاريخ:{" "}
              <span className="font-normal text-sm">
                {dayjs(student?.subscription?.paymentDate).format(
                  "dddd D MMMM YYYY"
                )}
              </span>
            </p>
          </div>
          <div className="flex items-end justify-between p-[7px]">
            <p className="font-bold text-lg flex items-center gap-1">
              ملاحظات:{" "}
              <span className="text-sm font-normal">
                {student?.subscription?.price -
                  student?.subscription?.studentPayment !==
                  0 && (
                  <>
                    {student?.subscription?.price -
                      student?.subscription?.studentPayment >
                    0 ? (
                      <p>
                        <span>
                          متبقي للمعلم{" "}
                          {student?.subscription?.price -
                            student?.subscription?.studentPayment}{" "}
                          جنيه
                        </span>{" "}
                      </p>
                    ) : (
                      <p>
                        <span>
                          متبقي للطالب{" "}
                          {student?.subscription?.studentPayment -
                            student?.subscription?.price}{" "}
                          جنيه
                        </span>{" "}
                      </p>
                    )}
                  </>
                )}
              </span>
            </p>
          </div>
        </div>
      ))}
    </main>
  );
}

export default PaymentReceipts;
