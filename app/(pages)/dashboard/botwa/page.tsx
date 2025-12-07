"use client"
import { Card } from "@/components/ui/card";
import { useGetConnectionBotWa } from "@/app/hooks/BotWA/useBotWA";

export default function WaPage() {

const {data : connection} = useGetConnectionBotWa()
console.log(connection)

  return (
    <>
      <div className="min-h-screen w-full max-w-7xl mx-auto my-8 p-6">
        <div className="font-bold text-3xl mb-3">Test connection instance</div>
        <Card><div>
          Name : {connection?.name }</div></Card>
      </div>
    </>
  );  
}
