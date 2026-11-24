import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
export default function NotFound(){return <main className="flex-1 flex items-center justify-center text-center p-8"><div><p className="micro">OUTSIDE THE SHOWROOM / 404</p><h1 className="font-display text-4xl font-semibold mt-5">Let’s get you back on stage.</h1><p className="text-subtle mt-4">This page is not part of your studio.</p><Link to="/" className="primary mt-8 inline-flex">Return to Showtime<ArrowUpRight size={17}/></Link></div></main>;}
