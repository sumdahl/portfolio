import Image from 'next/image';

export function ProfilePhoto() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-action rounded-full blur-xl opacity-50" />
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-accent shadow-2xl">
        <Image
          src="/images/profile/profile.jpeg"
          alt="Sumiran Dahal"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 192px, 192px"
        />
      </div>
    </div>
  );
}
