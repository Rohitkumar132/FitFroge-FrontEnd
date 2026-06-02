import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
    {items.map(item => (
      <span key={item.label} className="flex items-center gap-2">
        <ChevronRight size={14} />
        {item.to ? (
          <Link to={item.to} className="hover:text-primary transition-colors">{item.label}</Link>
        ) : (
          <span className="text-foreground font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;

