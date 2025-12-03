import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    storeName: "Modern Thread",
    category: "Fashion & Apparel",
    logo: "/image/Modern Thread.jpg",
    quote:
      '"Loukify helped us launch our fashion store in just 2 days. Sales increased 300% in the first month!"',
    revenue: "$10,000+",
    metric: "Monthly Revenue",
  },
  {
    storeName: "Khmer Kitchen",
    category: "Food & Restaurant",
    logo: "/image/HEL-Corner.jpg",
    quote:
      '"Online ordering made easy! Our customers love the seamless experience and we\'ve doubled our reach."',
    revenue: "20,000+",
    metric: "Month Orders",
  },
  {
    storeName: "KDMV",
    category: "Fashion & Apparel",
    logo: "/image/KDMV.png",
    quote:
      '"Loukify helped us launch our fashion store in just 2 days. Sales increased 300% in the first month!"',
    revenue: "$15,000+",
    metric: "Monthly Revenue",
  },
];

const CustomerSection = () => {
  return (
    <section id="customer-section" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            See what our customers have built
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Real stores created by Cambodian entrepreneurs using Loukify
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-15 mb-12">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.storeName}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#76716D] text-white text-xs px-2 py-1 rounded-full">
                    Live Store
                  </span>
                </div>
                <img
                  src={testimonial.logo || "/placeholder.svg"}
                  alt={`${testimonial.storeName} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                    <img
                      src={testimonial.logo || "/placeholder.svg"}
                      alt={`${testimonial.storeName} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {testimonial.storeName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonial.category}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  {testimonial.quote}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    {testimonial.metric}
                  </span>
                  <span className="font-semibold text-lg text-gray-900">
                    {testimonial.revenue}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-[#D9D9D9] border border-[#D9D9D9] hover:text-primary transition-colors"
          >
            View More Success Stories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomerSection;
