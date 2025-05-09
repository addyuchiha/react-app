import Card from "./Card"

interface Props {
  noTitle: boolean
}

function Pricing({noTitle=false}: Props) {
  return (
    <section id="pricing">
      {
        !noTitle && <h1 className="text-6xl font-bold text-center">Pricing</h1>
      }
        <div className={`${!noTitle ? 'py-24' : ''} space-y-8 md:space-y-0 md:grid grid-cols-3 md:space-x-4 max-w-5xl mx-auto`}>
            <Card type="Basic" price={99} features={["Lorem, ipsum.", "Lorem, ipsum dolor.", "Feature 1", "Lorem, dolor.", "Dolor", "Another Feat", "Feature 1"]} priceID="price_1RC0JvDNh6XDCW9yDqmd0gUS" />
            <Card type="Standard" price={149} features={["Lorem, ipsum.", "Lorem, ipsum dolor.", "Feature 1", "Lorem, dolor.", "Dolor", "Another Feat", "Feature 1"]} priceID="price_1RC0JvDNh6XDCW9yDqmd0gUS" />
            <Card type="Premium" price={299} features={["Lorem, ipsum.", "Lorem, ipsum dolor.", "Feature 1", "Lorem, dolor.", "Dolor", "Another Feat", "Feature 1"]} priceID="price_1RC0JvDNh6XDCW9yDqmd0gUS" />
        </div>
    </section>
  )
}

export default Pricing