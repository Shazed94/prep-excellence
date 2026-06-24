import { useNavigate } from "@tanstack/react-router";

interface OrderItem {
  name: string;
  price: number;
}

export function ConfirmStep({
  name,
  email,
  total,
  orderId,
  items,
}: {
  name: string;
  email: string;
  total: number;
  orderId: string;
  items: OrderItem[];
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 pb-12 text-center">
        <img src="/order-complete.png" alt="" className="size-32 mb-5" />
        <h1 className="text-[32px] md:text-[48px] leading-[38px] md:leading-14 -tracking-[2px] text-[#141B34] font-semibold mb-4">
          Thank you {name}, your order
          <br />
          has been placed successfully
        </h1>
        <p className="p text-[#676764]! mb-1">
          Order ID: <strong className="text-[#141511]">{orderId}</strong>
        </p>
        <p className="p text-[#676764]! mb-2">
          Total paid:{" "}
          <strong className="text-[#141511]">${total.toFixed(2)}</strong>
        </p>
        {items.length > 0 && (
          <div className="mb-4 text-left max-w-md w-full">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between px-4 py-2 text-sm">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-900 font-semibold">
                    ${item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <br />
        <strong className="text-[#141511]">{email}</strong>
      </div>
      <button
        type="button"
        onClick={() => navigate({ to: "/dashboard/student/my-course" })}
        className="px-8 py-3.5 gradient text-white font-semibold rounded-lg transition-colors text-sm block w-fit mx-auto"
      >
        Continue to Dashboard
      </button>
    </>
  );
}
