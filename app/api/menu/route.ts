import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

export function GET() {
  return NextResponse.json(menu);
}