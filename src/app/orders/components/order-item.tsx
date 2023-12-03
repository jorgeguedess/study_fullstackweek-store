import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import OrderProductItem from "./order-product-item";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { convertToCoin } from "@/utils/convertToCoin";
import { computeProductTotalPrice } from "@/helpers/products";
import { getOrderStatus } from "../helpers/status";

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      orderProducts: {
        include: { product: true };
      };
    };
  }>;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const subtotal = useMemo(() => {
    return order.orderProducts.reduce((acc, orderProduct) => {
      return (
        acc + Number(orderProduct.product.basePrice) * orderProduct.quantity
      );
    }, 0);
  }, [order.orderProducts]);

  const total = useMemo(() => {
    return order.orderProducts.reduce((acc, product) => {
      const productWithTotalPrice = computeProductTotalPrice(product.product);
      return acc + productWithTotalPrice.totalPrice * product.quantity;
    }, 0);
  }, [order.orderProducts]);

  const totalDiscount = total - subtotal;

  return (
    <Card className="px-5">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={order.id}>
          <AccordionTrigger className="uppercase">
            <div className="flex flex-col gap-1 text-left">
              <p>Pedido com {order.orderProducts.length} produto(s)</p>
              <span className="text-sm opacity-60">
                Feito em {format(order.createdAt, "dd/MM/y 'às' HH:mm")}
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">
                  <p className="uppercase">Status</p>
                  <p
                    className={
                      order.status === "PAYMENT_CONFIRMED"
                        ? "text-[#8162FF]"
                        : "text-red-500"
                    }
                  >
                    {getOrderStatus(order.status)}
                  </p>
                </div>

                <div>
                  <p className="font-bold uppercase">Data</p>
                  <p className="opacity-60">
                    {format(order.createdAt, "dd/MM/y")}
                  </p>
                </div>

                <div>
                  <p className="font-bold uppercase">Pagamento</p>
                  <p className="opacity-60">Cartão</p>
                </div>
              </div>

              {order.orderProducts.map((orderProduct) => (
                <OrderProductItem
                  key={orderProduct.id}
                  orderProduct={orderProduct}
                />
              ))}

              <div className="flex w-full flex-col gap-1 text-xs">
                <Separator />
                <div className="flex w-full justify-between py-3">
                  <p>Subtotal</p>
                  <p>{convertToCoin(subtotal)}</p>
                </div>

                <Separator />

                <div className="flex w-full justify-between py-3">
                  <p>Entrega</p>
                  <p className="uppercase">GRÁTIS</p>
                </div>

                <Separator />

                <div className="flex w-full justify-between py-3">
                  <p>Descontos</p>
                  <p>{convertToCoin(totalDiscount)}</p>
                </div>

                <Separator />

                <div className="flex w-full justify-between py-3 font-bold">
                  <p>Total</p>
                  <p>{convertToCoin(total)}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default OrderItem;
