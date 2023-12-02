import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { useContext } from "react";
import { CartContext } from "@/providers/cart";
import CartItem from "./cart-item";
import { computeProductTotalPrice } from "@/helpers/products";
import { Separator } from "./separator";
import { convertToCoin } from "@/utils/convertToCoin";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";

const Cart = () => {
  const { products, subtotal, total, totalDiscount } = useContext(CartContext);

  return (
    <div className="flex h-full flex-col gap-8">
      <Badge
        className="w-fit gap-1 border-2 border-primary px-3 py-[0.375rem] text-base uppercase"
        variant="outline"
      >
        <ShoppingCartIcon size={16} />
        Carrinho
      </Badge>

      {/* RENDERIZAR OS PRODUTOS */}
      <div className="flex h-full flex-col gap-5 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex h-full flex-col gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <CartItem
                  product={computeProductTotalPrice(product as any) as any}
                  key={product.id}
                />
              ))
            ) : (
              <p className="text-center font-bold">
                Carrinho vazio. Vamos fazer compras?
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-col gap-3">
        <Separator />

        <div className="flex items-center justify-between text-xs">
          <p>Subtotal</p>
          <p>{convertToCoin(subtotal)}</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-xs">
          <p>Entrega</p>
          <p className="uppercase">Grátis</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-xs">
          <p>Descontos</p>
          <p>{convertToCoin(totalDiscount)}</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm font-bold">
          <p>Total</p>
          <p>{convertToCoin(total)}</p>
        </div>

        <Button className="mt-7 font-bold uppercase">Finalizar compra</Button>
      </div>
    </div>
  );
};

export default Cart;
