import { NextResponse } from "next/server";
import corsConfig from "@/utils/cors.config";

export default class ResponseHelper {
  static success(status: number, message: string, data: {}) {
    return new NextResponse(
      JSON.stringify({ success: true, message, data: data }),
      { status, headers: { "Content-Type": "application/json", ...corsConfig } }
    );
  }

  static failed(status: number, message: string, err: {}) {
    return new NextResponse(
      JSON.stringify({ success: false, message, data: err }),
      { status, headers: { "Content-Type": "application/json", ...corsConfig } }
    );
  }
}
