function keyUp(event) {
   if (event.key == 'F8') {
      debugger;
   }
}

export default {
   displayName: 'F8 Fix',
   id: 'f8-fix',
   executor: async () => {
      document.addEventListener('keyup', keyUp);

      return () => {
         document.removeEventListener('keyup', keyUp);
      };
   }
};