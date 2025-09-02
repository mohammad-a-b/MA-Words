let singletonUser
let initialized = false
let initPromise = null

export const useAuth = () => {
  if (!singletonUser) singletonUser = ref(null)
  const user = singletonUser
  const { $supabase } = useNuxtApp()

  const fetchUser = async () => {
    const { data } = await $supabase.auth.getUser()
    user.value = data.user
  }

  const logout = async () => {
    try {
      const { error } = await $supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        return { success: false, error: error.message }
      }
      user.value = null
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  const initAuth = async () => {
    if (!process.client) return
    if (initialized) return
    if (initPromise) return initPromise
    initialized = true
    initPromise = (async () => {
      await fetchUser()
      $supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null
      })
    })()
    return initPromise
  }

  if (process.client && !initialized && !initPromise) {
    initAuth()
  }

  return { user, logout, initAuth }
}
