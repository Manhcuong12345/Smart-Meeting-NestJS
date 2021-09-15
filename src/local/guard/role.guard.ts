import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';


//Xu ly phan quyen cho nguoi dung
@Injectable()
export class RolesGuard implements CanActivate {
  //khai bao du lieu dung
  constructor(private readonly model: string, private readonly action: string) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    //// Người dùng quản trị có thể truy cập bất kỳ yêu cầu nào
    if (req.user.admin) return true;
    if (this.model === 'admin') throw new HttpException({ error_code: "401", error_message: "unauthorized" }, 401)

    let permissions = []
    let { user } = req

    // Nếu người dùng không phải là quản trị viên và không có bất kỳ quyền nào,
    // một lỗi sẽ được trả lại cho người dùng
    if (!user.roles || user.roles.length === 0) {
      throw new HttpException({ error_code: "401", error_message: "unauthorized" }, 401)
    }
    // Nhận tất cả các quyền của người dùng này
    user.roles.forEach(role => {
      if (role.permissions.length > 0) {
        permissions = permissions.concat(role.permissions)
      }
    })

    // Tìm kiếm trong danh sách quyền của người dùng xem quyền đó có khớp với biến model và permisssion không
    // Nếu không có quyền phù hợp, người dùng sẽ trả lại lỗi
    // nếu nó có quyền phù hợp, người dùng có thể truy cập vào yêu cầu này
    const allow = permissions.find(permission => permission.model === this.model && permission.permissions[this.action])
    if (!allow) {
      throw new HttpException({ error_code: "401", error_message: "unauthorized" }, 401)
    }
    return true;
  }
}
