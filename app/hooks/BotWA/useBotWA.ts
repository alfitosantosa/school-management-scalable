
import { useQuery } from "@tanstack/react-query";
import { NextResponse } from "next/server";
  
export const useGetConnectionBotWa = () => {
  
useQuery({
    queryKey: ["evo"],
    queryFn: async () => {

try {
  const options = {method: 'GET', headers: {apikey: `${process.env.NEXT_PUBLIC_EVO_APIKEY}`}};

fetch(`${process.env.NEXT_PUBLIC_EVO_URL}/instance/fetchInstances?instanceName=fajarsentosa&instanceId=d33e0c10-0457-4788-a536-9ac6530efec2`, options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));

  return options;

} catch (error) {
  console.error("Error fetching users:", error);
  return  NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
}

}
})
}



