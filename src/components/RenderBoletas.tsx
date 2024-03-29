import { useEffect, useState } from "react";
import { Boleta } from "./Boleta";

interface Props {
  items: any | any[];
}
export const RenderBoletas = ({ items }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [renderedItems, setRenderedItems] = useState<object[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < items.length) {
        const currentItem = items[currentIndex];
        setRenderedItems((prevItems) => [...prevItems, currentItem]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 2000); // Wait for 2 seconds between each item

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, items]);

  return (
    <>
      {/* {renderedItems.map((item: object, index: number) => ( */}
      {renderedItems.map((item: object) => (
        <Boleta item={item} />
      ))}
    </>
  );
};
