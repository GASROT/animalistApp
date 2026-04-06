import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";


export const Container = styled.View`
  flex: 1;
  padding: 30px;
  background-color: #0B1622;
`;
export const Form = styled.View`
  flex-direction: row;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-color: #151F2E;
`;
export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#9FADBD",
})`
  flex: 1;
  height: 48px;
  background: #151F2E;
  border-radius: 8px;
  padding: 0 15px;
  border: 1px solid #11161D;
  color: #9FADBD;
  font-size: 15px;
`;

export const SubmitButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  background: #3DB4F2;
  border-radius: 8px;
  margin-left: 10px;
  padding: 0 14px;
  opacity: ${(props) => (props.loading ? 0.7 : 1)};
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: 20px;
`;

export const AnimeCard = styled.View`
  align-items: center;
  margin: 0 0px 20px;
  background: #151F2E;
  padding: 20px 15px;
  border-radius: 12px;
  elevation: 3;
`;
export const CoverImage = styled.Image`
  width: 100px;
  height: 150px;
  border-radius: 8px;
  background: #0B1622;
`;
export const AnimeTitle = styled.Text`
  font-size: 16px;
  color: #FFFFFF;
  font-weight: bold;
  margin-top: 12px;
  text-align: center;
`;
export const AnimeInfo = styled.Text.attrs({
  numberOfLines: 2,
})`
  font-size: 14px;
  line-height: 20px;
  color: #9FADBD;
  margin-top: 6px;
  margin-bottom: 12px;
  text-align: center;
`;

export const ProfileButton = styled(RectButton)`
  margin-top: 10px;
  align-self: stretch;
  border-radius: 8px;
  background: #3DB4F2;
  justify-content: center;
  align-items: center;
  height: 42px;
`;
export const ProfileButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const AuthCard = styled.View`
  background-color: #151F2E;
  width: 100%;
  padding: 30px 20px;
  border-radius: 12px;
  elevation: 5;
  align-items: center;
`;

// Estilo da Página de Detalhes
export const Header = styled.View`
  padding: 30px 15px;
  align-items: center;
  justify-content: center;
  background: #151F2E;
  border-radius: 12px;
  elevation: 3;
  margin-bottom: 20px;
`;

export const CoverExpanded = styled.Image`
  width: 160px;
  height: 230px;
  border-radius: 10px;
  background: #0B1622;
  margin-bottom: 15px;
`;
export const AnimeTitleExpanded = styled.Text`
  font-size: 20px;
  color: #FFFFFF;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;

export const AnimeInfoExpanded = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: #9FADBD;
  text-align: center;
`;

export const WatchLaterButton = styled.TouchableOpacity`
  background-color: #E23946;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 15px;
  elevation: 2;
`;

export const WatchLaterText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
  font-size: 15px;
`;

export const SectionContainer = styled.View`
  margin-top: 20px;
  background-color: #151F2E;
  padding: 20px;
  border-radius: 12px;
  elevation: 3;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #FFFFFF;
`;

export const SectionDescription = styled.Text`
  font-size: 15px;
  color: #9FADBD;
  line-height: 24px;
`;

export const CharacterCard = styled.View`
  margin-right: 15px;
  align-items: center;
  width: 80px;
`;

export const CharacterImage = styled.Image`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const CharacterName = styled.Text.attrs({
  numberOfLines: 2,
})`
  color: #9FADBD;
  font-size: 12px;
  text-align: center;
`;

export const EmptyText = styled.Text`
  color: #9FADBD;
  font-size: 15px;
`;

export const ReviewCard = styled.View`
  margin-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #202D3F;
  padding-bottom: 15px;
`;

export const ReviewHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const ReviewAuthor = styled.Text`
  color: #3DB4F2;
  font-weight: bold;
  font-size: 15px;
`;

export const ReviewRating = styled.Text`
  color: #E23946;
  font-weight: bold;
`;

export const ReviewText = styled.Text`
  color: #9FADBD;
  font-size: 14px;
  line-height: 20px;
`;

export const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const EmptyStateTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 10px;
  text-align: center;
`;

export const EmptyStateText = styled.Text`
  font-size: 15px;
  color: #9FADBD;
  text-align: center;
  line-height: 22px;
`;

export const RemoveButton = styled(RectButton)`
  margin-top: 10px;
  align-self: stretch;
  border-radius: 8px;
  background: #E23946;
  justify-content: center;
  align-items: center;
  height: 42px;
`;

// ============================================
// STYLESHEET - ESTILOS DAS PÁGINAS
// ============================================

// ---- LOGIN PAGE ----
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1622",
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#151F2E",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    width: "100%",
  },
  welcomeTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#9FADBD",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#11161D",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#3DB4F2",
    borderRadius: 8,
    padding: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

// ---- REGISTER PAGE ----
export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1622",
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#151F2E",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    width: "100%",
  },
  welcomeTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#9FADBD",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#11161D",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#3DB4F2",
    borderRadius: 8,
    padding: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

// ---- HOME PAGE ----
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1622",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  horizontalCard: {
    width: 140,
    marginRight: 10,
    marginBottom: 0,
    paddingBottom: 10,
  },
  horizontalImage: {
    height: 180,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  myAnimesButton: {
    flex: 1,
    backgroundColor: "#202D3F",
    marginRight: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#3DB4F2",
    borderWidth: 1,
  },
  watchLaterButton: {
    flex: 1,
    backgroundColor: "#151F2E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#E23946",
    borderWidth: 1,
  },
  myAnimesText: {
    color: "#3DB4F2",
    fontWeight: "bold",
    fontSize: 14,
  },
  watchLaterText: {
    color: "#E23946",
    fontWeight: "bold",
    fontSize: 14,
  },
  favoriteButton: {
    backgroundColor: "#151F2E",
    marginTop: 6,
    marginHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
    borderColor: "#3DB4F2",
    borderWidth: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

// ---- WATCHLATER PAGE ----
export const watchLaterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1622",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#9FADBD",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptySubtitle: {
    color: "#748899",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});

// ---- PROFILE PAGE ----
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1622",
  },
  headerProfile: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#151F2E",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  profileUsername: {
    fontSize: 16,
    color: "#9FADBD",
    marginTop: 5,
  },
  infoBox: {
    margin: 20,
    padding: 15,
    backgroundColor: "#151F2E",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3DB4F2",
  },
  infoText: {
    color: "#D3D9DF",
    fontSize: 15,
    marginBottom: 5,
  },
  infoBold: {
    fontWeight: "bold",
    color: "#FFF",
  },
  section: {
    marginTop: 10,
    paddingLeft: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    maxWidth: "75%",
  },
  seeAll: {
    fontSize: 14,
    color: "#3DB4F2",
    fontWeight: "bold",
  },
  horizontalCard: {
    width: 110,
    marginRight: 15,
    paddingBottom: 5,
  },
  horizontalImage: {
    height: 160,
  },
  emptyText: {
    color: "#748899",
    fontStyle: "italic",
    marginBottom: 10,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#E23946",
    margin: 30,
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#151F2E",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#9FADBD",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#0B1622",
    color: "#FFF",
    borderWidth: 1,
    borderColor: "#3DB4F2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#202D3F",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#9FADBD",
    fontWeight: "bold",
  },
  confirmDeleteBtn: {
    flex: 1,
    backgroundColor: "#E23946",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

// ---- ROUTES PAGE - MODAL MENU ----
export const routesStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 15,
    backgroundColor: "#151F2E",
    borderRadius: 8,
    padding: 15,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userEmail: {
    fontSize: 12,
    color: "#9FADBD",
  },
  divider: {
    height: 1,
    backgroundColor: "#0B1622",
    marginVertical: 10,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  logoutText: {
    color: "#E74C3C",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

// ---- ROUTES PAGE - NAVIGATION HEADER OPTIONS ----
export const defaultHeaderOptions = {
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: "#151F2E",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  headerTintColor: "#9FADBD",
};
