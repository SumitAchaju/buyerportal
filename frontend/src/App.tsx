import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";
import { routes } from "./Routes";
import { ToastContainer } from "react-toastify";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RouterProvider router={routes} />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

export default App;
