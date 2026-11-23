import { StoreChrome } from "@/components/StoreChrome";
import { browserMailMode, web3formsKey } from "@/lib/mail";
import { paymentProviders } from "@/lib/payments";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const providers = await paymentProviders();
  return (
    <StoreChrome
      providers={providers}
      mailMode={browserMailMode()}
      web3formsAccessKey={web3formsKey()}
    >
      {children}
    </StoreChrome>
  );
}
