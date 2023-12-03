// eslint-disable-next-line consistent-return

// eslint-disable-next-line consistent-return
export default function (context) {
  if (!context.store.state.auth.loggedIn) return context.redirect('/?next=' + window.location.pathname)
  else if (!$can(context.route?.meta[0], context.store.state.auth)) return context.redirect('/dashboard')
  //else return context.redirect('/')
}

function $can(permission = {}, auth) {
  if (auth.loggedIn) {
    const user_permissions = auth.user.ability ? auth.user.ability : []

    if (user_permissions && user_permissions.length) {
      let index = user_permissions.findIndex(item => item.action === permission.action && item.subject === permission.subject);
      return index >= 0;
    } else {
      return false
    }
  } else return false
}
