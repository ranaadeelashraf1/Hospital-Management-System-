export default function Footer() {
  return (
    <footer className="px-6 py-4 text-center text-xs text-ink-400 border-t border-ink-100 bg-white">
      © {new Date().getFullYear()} MediCare Hospital System. All rights reserved.
    </footer>
  );
}
