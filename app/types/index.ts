export interface User {
    id: number
    name: string
    email: string
    is_admin: boolean 
}
export interface Movie {
    id: number
    title: string
    description: string
    release_year: number
    duration: number 
    poster_url: string | null
    genres: Genre[]
    ratings: Rating[]
    comments: Comment[]
}
export interface Genre {
    id: number
    name: string
}
export interface Rating {
    id: number
    user_id: number
    movie_id: number
    rating: number
    movie?: Movie
    user?: User
}
export interface Comment {
    id: number
    user_id: number
    movie_id: number
    content: string
    created_at: string
    movie?: Movie
    user?: User
}