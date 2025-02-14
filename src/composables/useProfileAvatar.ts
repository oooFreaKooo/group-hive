export const useProfileAvatar = () => {
    const avatarUrl = useState<string | null>('profile-avatar', () => null)

    function updateAvatar (newUrl: string | null) {
        avatarUrl.value = newUrl
    }

    return {
        avatarUrl,
        updateAvatar,
    }
}
