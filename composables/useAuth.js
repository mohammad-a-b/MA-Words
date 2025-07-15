export const useAuth = () => {
  const user = ref(null)
  const { $supabase } = useNuxtApp()

  const fetchUser = async () => {
    const { data } = await $supabase.auth.getUser()
    user.value = data.user
  }

  onMounted(() => {
    fetchUser()
    $supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  })

  return { user }
}
