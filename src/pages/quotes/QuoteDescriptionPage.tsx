import { assets } from "../../assets/icons";

export function QuoteDescriptionPage() {
  const jobDet = [
    "Material Supply – Provision of high-quality materials for flooring, partitions, and finishing.",
    "Floor Tiling – Removal of existing surface and installation of new tiles across designated areas.",
    "Partition Adjustments – Modifications and realignment of partitions to match the client’s updated layout.",
  ];

  return (
    <div className="bg-white rounded-[7px] flex flex-col gap-6 p-5">
      <div className="quote-description-section">
        <span className="header"> Job Description </span>
        <span className="text-placeholder-text text-sm">
          This quote covers the renovation of Acme Corp’s office space,
          including material supply, floor tiling, and partition adjustments. It
          also includes labor for installation and finishing work.
          <ul className="list-disc p-5">
            {jobDet.map((det) => (
              <li> {det} </li>
            ))}
          </ul>
        </span>
        <a className="underline"> Read More </a>
      </div>

      <div className="dashed-y-separators" />

      <div className="quote-description-section">
        <span className="header"> Notes (Not visible on quote) </span>
        <span className="text-placeholder-text text-sm">
          The client, Brightline Solutions, is looking for a complete redesign
          of their 3rd-floor workspace to support a hybrid work model. During
          the initial discussion, they emphasized the need for modular
          furniture, soundproof meeting pods, and eco-friendly materials
          wherever possible. The proposed layout (v2) includes an open
          collaboration area and separate focus zones, which the client seemed
          to appreciate. They also expressed interest in exploring additional
          lighting options and asked for cost comparisons between standard and
          smart LED systems. The client’s preliminary budget is around £18,000,
          but there’s flexibility if sustainable or higher-quality materials are
          justified.
        </span>
        <a className="underline"> Read More </a>
      </div>

      <div className="dashed-y-separators" />

      <div className="quote-description-section">
        <span className="header"> Attachments </span>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((i) => (
            <div
              className="min-h-12 flex justify-between items-center border rounded-[7px] border-separator border-dashed p-2 pr-4"
              key={i}
            >
              <div className="min-h-8 flex gap-3 items-center">
                <div className="bg-table-head w-8 rounded-xs aspect-square flex items-center justify-center cursor-pointer">
                  <img
                    src={assets.attachmentIcon}
                    className="w-4 aspect-square"
                  />
                </div>
                <span> {`Attachment${i}.png`} </span>
              </div>

              <button>
                <img src={assets.moreIcon} className="w-3.75 h-0.75" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
