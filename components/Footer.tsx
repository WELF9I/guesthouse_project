import { FacebookIcon, InstagramIcon } from "lucide-react"
import Link from "next/link"

const info=[
  {
    name:'Home',
    route:'/'
  },
  {
    name:'Contact',
    route:'/Contact'
  },
  {
    name:'About',
    route:'/About'
  },
]

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-16 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-600">PAGES</h3>
            <ul className="space-y-2">
              {info.map((item) => (
                <li key={item.name}>
                  <Link href={item.route} className="hover:text-gray-400">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-600">SOCIAL MEDIA</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-400">
                <FacebookIcon className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:text-gray-400">
                <InstagramIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-600">NEWSLETTER</h3>
            <p className="mb-4">Stay up-to-date with the latest news, exclusive offers, and upcoming events by subscribing to our newsletter. Receive curated content directly to your inbox, including updates on new features, special promotions, and tips to enhance your experience. Don’t miss out on important announcements and valuable insights—sign up today and be the first to know what’s happening!</p>
           
          </div>
        </div>
        
        <div className="border-t border-olive-700 pt-8 text-center">
          <div className="mb-4">
            <div className="text-xl font-bold">VillaAcapella</div>
          </div>
          <p className="text-sm mb-2">© VillaAcapella, LLC. All rights reserved.</p>
          <p className="text-sm">
            +216 27 061 110 — Sousse, Tunisia
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer