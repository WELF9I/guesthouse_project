import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const PastGuests = () => {
  const reviews = [
    {
        rating: 5,
        title: "We had an amazing stay at Villa Acapella!",
        content: "Our stay at Villa Acapella was absolutely fantastic. The guesthouse was beautifully decorated and provided a warm and welcoming atmosphere. The amenities were top-notch, and the staff was incredibly friendly and attentive. The location offered stunning views and easy access to local attractions. We couldn't have asked for a better experience!",
        author: "Mohamed Ali"
    },
    {
        rating: 4,
        title: "A charming and cozy retreat.",
        content: "Villa Acapella is a delightful retreat with a cozy and charming ambiance. The rooms were comfortable and clean, and the surrounding area was peaceful. The breakfast served was delicious, though we felt that the selection could be slightly expanded. Overall, it was a lovely stay and we would definitely return.",
        author: "Bilel ben Ali"
    },
    {
        rating: 3,
        title: "Nice stay but room for improvement.",
        content: "Villa Acapella has a lot going for it, including a beautiful setting and friendly staff. However, we encountered a few issues during our stay, such as a lack of hot water in the morning and some noise from the street. While the overall experience was pleasant, these issues slightly detracted from what could have been a perfect stay.",
        author: "Salma ben alaya"
    }
];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">Past guests.</h2>
      <p className="text-center text-gray-600 mb-8">
        Don't take our word for it! Have a look at what our previous guests say about their stay at VillaAcapella.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card key={index} className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{review.content}</p>
              <p className="text-sm font-medium">{review.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PastGuests