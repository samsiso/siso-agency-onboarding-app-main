import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NFTMetadata {
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface NFTDetailsModalProps {
  nft: NFTMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NFTDetailsModal = ({ nft, isOpen, onClose }: NFTDetailsModalProps) => {
  if (!nft) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/90 border-siso-text/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-siso-text-bold">
            {nft.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <div>
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {nft.description && (
                <div>
                  <h3 className="text-sm font-medium text-siso-text/60 mb-1">Description</h3>
                  <p className="text-siso-text">{nft.description}</p>
                </div>
              )}
              {nft.attributes && nft.attributes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-siso-text/60 mb-2">Attributes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {nft.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="bg-siso-text/5 p-2 rounded-lg"
                      >
                        <div className="text-xs text-siso-text/60">{attr.trait_type}</div>
                        <div className="text-sm text-siso-text-bold">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};