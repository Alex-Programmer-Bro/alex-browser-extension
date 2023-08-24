import { useEffect, useState } from "react";

const loopAction = ({
  count = 3,
  loopFn,
  onFinished,
}: {
  count?: number;
  loopFn: () => void;
  onFinished: () => void;
}) => {
  if (count) {
    setTimeout(() => {
      loopFn();
      count--;
      loopAction({ loopFn, count, onFinished });
    }, 1000);
  } else {
    onFinished();
  }
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(3);

  useEffect(() => {
    if (loading) {
      return;
    }

    const onMessage: (
      message: { action: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: string) => void
    ) => void = (msg, _, sendResponse) => {
      switch (msg.action) {
        case "debugger": {
          setLoading(true);
          loopAction({
            loopFn: () => setIndex((pre) => pre - 1),
            onFinished: () => {
              setIndex(3);
              setLoading(false);
              setTimeout(() => {
                // eslint-disable-next-line no-debugger
                debugger;
              });
            },
          });
          break;
        }
        case "contentEditable": {
          document.documentElement.contentEditable = "true";
          break;
        }
      }
      sendResponse("clicked");
    };

    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [loading]);

  return index && loading ? (
    <div className="fixed left-4 bottom-4">
      <div className="bg-white text-center w-16 h-16 rounded-full flex justify-center items-center text-gray-800 text-2xl font-bold shadow-[0_0_100px_0_rgba(0,0,0,0.3)]">
        {index}
      </div>
    </div>
  ) : null;
}
