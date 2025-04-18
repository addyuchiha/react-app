interface Props {
    type: string,
    price: number,
    features: string[]
}

function Card({type, price, features}: Props) {
  return (
    <div className="rounded-3xl shadow-lg shadow-accent border-accent border-4 p-8 flex flex-col space-y-4 items-center">
      <span className="rounded-full text-white bg-primary p-3 py-1 text-sm w-min font-semibold">
        {type}
      </span>
      <h2 className="text-7xl font-bold">${price}</h2>
      <p className="text-xl font-bold">billed monthly</p>
      <ul>
        {features.map(feature => 
            <li className="flex space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
                />
            </svg>
            <span>
                {feature}
            </span>
            </li>
        )}
      </ul>
      <button className="w-full bg-accent p-2 rounded-xl text-white font-bold hover:brightness-90 transition-all">
        Buy Now
      </button>
    </div>
  );
}

export default Card;
