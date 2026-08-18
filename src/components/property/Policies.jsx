import { useState } from "react";

export default function Policies({ houseRules = [], importantInfo = [], cancellation }) {
  const [showAllRules, setShowAllRules] = useState(false);
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [showAllCancellation, setShowAllCancellation] = useState(false);
  return (
    <div className="flex flex-col">
      {/* House Rules */}
      <div className="py-8 border-b border-gray-200 flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="w-full md:w-1/3">
          <h2 className="text-[20px] font-bold text-[#2B2B2B]">House Rules</h2>
        </div>
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[15px] text-[#7B7468]">
            {(showAllRules ? houseRules : houseRules.slice(0, 4)).map((rule, idx) => (
              <div key={idx}>{rule}</div>
            ))}
          </div>
          {houseRules.length > 4 && (
            <button 
              onClick={() => setShowAllRules(!showAllRules)}
              className="text-[#0050FF] font-semibold text-[15px] hover:underline mt-4 text-left"
            >
              {showAllRules ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>

      {/* Damage and incidentals */}
      <div className="py-8 border-b border-gray-200 flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="w-full md:w-1/3">
          <h2 className="text-[20px] font-bold text-[#2B2B2B]">Damage and incidentals</h2>
        </div>
        <div className="w-full md:w-2/3">
          <p className="text-[15px] text-[#7B7468]">
            You will be responsible for any damage to the rental property caused by you or your party during your stay.
          </p>
        </div>
      </div>

      {/* Cancellation */}
      <div className="py-8 border-b border-gray-200 flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="w-full md:w-1/3">
          <h2 className="text-[20px] font-bold text-[#2B2B2B]">Cancellation</h2>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          
          {/* Timeline visualization */}
          <div className="w-full bg-[#FAF9F5] rounded-lg p-6 relative">
            <div className="w-full h-0.5 bg-gray-300 relative mt-4 mb-4">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-[#2B2B2B]"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-3 h-3 rounded-full border-2 border-[#2B2B2B] bg-[#FAF9F5] transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full border-2 border-[#2B2B2B] bg-[#FAF9F5]"></div>
              
              <div className="absolute -top-6 left-0 text-[12px] font-semibold text-[#2B2B2B]">Today</div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[12px] font-semibold text-[#2B2B2B]">Aug 14</div>
              <div className="absolute -top-6 right-0 text-[12px] font-semibold text-[#2B2B2B]">Check-in</div>
              
              <div className="absolute top-4 left-[25%] transform -translate-x-1/2 text-[12px] text-[#7B7468]">Partial refund</div>
              <div className="absolute top-4 left-[75%] transform -translate-x-1/2 text-[12px] text-[#7B7468]">No refund</div>
            </div>
          </div>

          {showAllCancellation ? (
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex gap-4 md:gap-8">
                <div className="w-16 shrink-0 pt-0.5">
                  <p className="text-[14px] text-[#2B2B2B] font-semibold leading-tight">Before</p>
                  <p className="text-[14px] text-[#2B2B2B] font-bold leading-tight">Aug 14</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-[#2B2B2B] text-[15px]">Partial refund</h4>
                  <p className="text-[15px] text-[#7B7468] leading-relaxed">
                    If you cancel your reservation before Aug 14 at 11:59pm you'll get a refund of 50% of the amount paid (minus the service fee). Times are based on the property's local time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-8">
                <div className="w-16 shrink-0 pt-0.5">
                  <p className="text-[14px] text-[#2B2B2B] font-semibold leading-tight">After</p>
                  <p className="text-[14px] text-[#2B2B2B] font-bold leading-tight">Aug 14</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-[#2B2B2B] text-[15px]">No refund</h4>
                  <p className="text-[15px] text-[#7B7468] leading-relaxed">
                    After that, you won't get a refund.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-[#2B2B2B] text-[15px]">Partial refund</h4>
              <p className="text-[15px] text-[#7B7468]">
                If you cancel your reservation before Aug 14 at 11:59pm you'll get a refund of 50% of the amount.
              </p>
            </div>
          )}
          
          <button 
            onClick={() => setShowAllCancellation(!showAllCancellation)}
            className="text-[#0050FF] font-semibold text-[15px] hover:underline text-left mt-2"
          >
            {showAllCancellation ? "See less" : "See more"}
          </button>
        </div>
      </div>

      {/* Important Information */}
      <div className="py-8 flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="w-full md:w-1/3">
          <h2 className="text-[20px] font-bold text-[#2B2B2B]">Important information</h2>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <h3 className="font-bold text-[#2B2B2B] text-[15px]">You need to know</h3>
          
          <div className="flex flex-col gap-3 text-[15px] text-[#7B7468]">
            {(showAllInfo ? importantInfo : importantInfo.slice(0, 3)).map((info, idx) => (
              <p key={idx} className={idx === 0 ? "font-semibold text-[#2B2B2B] text-sm mb-1" : ""}>
                {info}
              </p>
            ))}
          </div>

          {importantInfo.length > 3 && (
            <button 
              onClick={() => setShowAllInfo(!showAllInfo)}
              className="text-[#0050FF] font-semibold text-[15px] hover:underline text-left mt-2"
            >
              {showAllInfo ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
