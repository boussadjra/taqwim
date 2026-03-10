/**
 * Copied and adapted from Reka UI (https://github.com/unovue/reka-ui)
 * Copyright (c) 2023 UnoVue
 * Licensed under the MIT License
 * See:  * See: https://github.com/unovue/reka-ui/blob/main/LICENSE
 *
 * Original file url: https://github.com/unovue/reka-ui/blob/7ad854c1ab1f54a512b4c3d4d0549d6dceeed04b/packages/core/src/shared/createContext.ts
 */

import { type InjectionKey, inject, provide } from 'vue'

/**
 * @param providerComponentName - The name(s) of the component(s) providing the context.
 *
 * There are situations where context can come from multiple components. In such cases, you might need to give an array of component names to provide your context, instead of just a single string.
 *
 * @param contextName The description for injection key symbol.
 */
export function createContext<ContextValue>(providerComponentName: string | string[], contextName?: string) {
  const symbolDescription =
    typeof providerComponentName === 'string' && !contextName ? `${providerComponentName}Context` : contextName

  const injectionKey: InjectionKey<ContextValue | null> = Symbol(symbolDescription)

  /**
   * @param fallback The context value to return if the injection fails.
   *
   * @throws When context injection failed and no fallback is specified.
   * This happens when the component injecting the context is not a child of the root component providing the context.
   */
  const injectContext = <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ): T extends null ? ContextValue | null : ContextValue => {
    const context = inject(injectionKey, fallback)
    if (context) return context

    if (context === null) return context as any

    throw new Error(
      `Injection \`${injectionKey.toString()}\` not found. Component must be used within ${
        Array.isArray(providerComponentName)
          ? `one of the following components: ${providerComponentName.join(', ')}`
          : `\`${providerComponentName}\``
      }`,
    )
  }

  const provideContext = (contextValue: ContextValue) => {
    provide(injectionKey, contextValue)
    return contextValue
  }

  return [injectContext, provideContext] as const
}
