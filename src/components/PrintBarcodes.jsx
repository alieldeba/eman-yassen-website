import Barcode from "react-barcode";

function PrintBarcodes({ students }) {
  return (
    <section className="print:grid grid-cols-3 justify-items-center print-show hidden gap-4">
      {students.map((student) => (
        <div className="flex flex-col">
          <span className="text-center">{student.name}</span>
          <Barcode value={student.code.toString()} width={2} height={40} />
        </div>
      ))}
    </section>
  );
}

export default PrintBarcodes;
