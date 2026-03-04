import type { AttributifyAttributes } from '@unocss/preset-attributify'

// declare module 'solid-js' {
//   namespace JSX {
//     interface HTMLAttributes<T> extends AttributifyAttributes {}
//   }
// }

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes { }
  }
  namespace JSX {
    interface HTMLAttributes<> extends AttributifyAttributes {}
  }
}

declare module 'mammoth/mammoth.browser' {
  interface ConversionResult {
    value: string
    messages: unknown[]
  }
  interface MammothOptions {
    arrayBuffer: ArrayBuffer
  }
  const mammoth: {
    extractRawText(options: MammothOptions): Promise<ConversionResult>
    convertToHtml(options: MammothOptions): Promise<ConversionResult>
  }
  export default mammoth
}
