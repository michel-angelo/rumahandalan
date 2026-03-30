export type Location = {
  id: string
  district: string
  city: string
  province: string
}

export type ClusterImage = {
  id: string
  cluster_id: string
  image_url: string
  is_primary: boolean
  order: number
}

export type Cluster = {
  id: string
  name: string
  slug: string
  developer: string
  description: string
  image_url: string
  is_promo: boolean
  promo_label: string
  created_at: string
  images?: ClusterImage[]
}

export type Property = {
  id: string
  title: string
  slug: string
  type: 'rumah' | 'apartemen'
  status: 'tersedia' | 'inden' | 'terjual' | 'booked'
  condition: 'baru' | 'second'
  certificate: 'shm' | 'hgb' | 'ajb'
  price: number
  price_label: string
  price_per_month: number
  land_area: number
  building_area: number
  floors: number
  bedrooms: number
  bathrooms: number
  description: string
  whatsapp_number: string
  is_featured: boolean
  is_kpr: boolean
  is_cash_keras: boolean
  is_subsidi: boolean
  cluster_id: string
  location_id: string
  created_at: string
  updated_at: string
  cluster?: Cluster
  location?: Location
  images?: PropertyImage[]
}

export type PropertyImage = {
  id: string
  property_id: string
  image_url: string
  is_primary: boolean
  order: number
}

export type Testimonial = {
  id: string
  name: string
  content: string
  rating: number
  property_bought: string
  is_published: boolean
  created_at: string
}