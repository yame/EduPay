<script lang="ts" setup>
import { ChangePWDTO } from "@/@core/types";
import { useAuthStore } from "@/store/useAuthStore";
import { VForm } from "vuetify/components/VForm";

const refVForm = ref<VForm>()

const authStore = useAuthStore();
const {changePassword} = authStore;

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)


const confirmPassword = ref('')
const changePWDTO = ref<ChangePWDTO>({
  oldPassword:"",
  newPassword:""
})

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const router = useRouter()
//👉 - Change Password
const updatePassword = ()=>{

  
  refVForm.value?.validate().then(({valid})=>{
    if(valid){
      if(confirmPassword.value == changePWDTO.value.newPassword)
        changePassword(changePWDTO.value).then(()=>{
      router.push('/profile')})
    }
  })
} 


</script>
<template>
    <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm ref="refVForm" @submit.prevent="updatePassword">
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                 {{ changePWDTO.oldPassword }}
                <AppTextField
                  v-model="changePWDTO.oldPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Current Password"
                  autocomplete="on"
                  placeholder="Current Password"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                 {{changePWDTO.newPassword}}
                <AppTextField
                  v-model="changePWDTO.newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="New Password"
                  autocomplete="on"
                  placeholder="New Password"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                  :rules="[requiredValidator]"

                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <AppTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Confirm New Password"
                  autocomplete="on"
                  placeholder="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  :rules="[requiredValidator]"

                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-h6 text-medium-emphasis mb-4">
              Password Requirements:
            </h6>

            <VList class="card-list">
              <VListItem
                v-for="item in passwordRequirements"
                :key="item"
                :title="item"
                class="text-medium-emphasis"
              >
                <template #prepend>
                  <VIcon
                    size="10"
                    icon="tabler-circle-filled"
                  />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit">Save changes</VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    </VRow>
    <!-- !SECTION -->

</template>



<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
