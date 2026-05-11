'use client';

export type DiffItem = {
  key: string;
  type?: string;
  prev: string;
  curr: string;
  diff: string;
};

export function InteractiveDiffItem({ item }: { item: DiffItem }) {
  return (
    <div key={item.key} className="border p-2">
      <h3 className="font-semibold mb-1">
        {item.key} {item.type ? `(${item.type})` : ''}
      </h3>
      <div className="grid grid-cols-3 gap-2 border p-2 overflow-auto">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-1">Previous</span>
          <img src={`/api/qa/image?path=${encodeURIComponent(item.prev)}`} className="border" alt={`${item.key} previous screenshot`} />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm mb-1">Current</span>
          <img src={`/api/qa/image?path=${encodeURIComponent(item.curr)}`} className="border" alt={`${item.key} current screenshot`} />
        </div>
        <div className="flex flex-col items-center relative">
          <span className="text-sm mb-1">Diff</span>
          <img src={`/api/qa/image?path=${encodeURIComponent(item.diff)}`} className="border" alt={`${item.key} visual diff`} />
        </div>
      </div>
    </div>
  );
}
